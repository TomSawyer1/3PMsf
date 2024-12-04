import React, { useEffect, useState } from "react";
import { fetchData, postData, updateData, deleteData } from "../api/api";

const Listproduits = () => {
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formulaire pour ajouter ou modifier un produit
  const [productForm, setProductForm] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    categoryId: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("price");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Charger les produits et catégories depuis l'API
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const produitsResponse = await fetchData("/produits");
        const categoriesResponse = await fetchData("/categories");

        setProduits(produitsResponse);
        setFilteredProduits(produitsResponse);
        setCategories(categoriesResponse);

        setLoading(false);
      } catch (error) {
        setError("Erreur lors de la récupération des données");
        console.error(error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Filtrer les produits par recherche
  useEffect(() => {
    const filtered = produits.filter((produit) =>
      produit.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProduits(filtered);
    setCurrentPage(1);
  }, [searchTerm, produits]);

  // Trier les produits
  const sortedProduits = [...filteredProduits].sort((a, b) => {
    if (sortKey === "price") return a.price - b.price;
    if (sortKey === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  // Pagination
  const paginatedProduits = sortedProduits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sortedProduits.length / itemsPerPage);

  // Ajouter ou mettre à jour un produit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { id, name, description, price, categoryId } = productForm;

    if (!name || !description || !price || !categoryId) {
      alert("Tous les champs sont requis.");
      return;
    }

    try {
      if (id) {
        // Mettre à jour
        const updatedProduct = await updateData(`/produits/${id}`, {
          name,
          description,
          price,
          category_id: categoryId,
        });
        setProduits((prev) =>
          prev.map((prod) => (prod.id === id ? updatedProduct : prod))
        );
      } else {
        // Créer
        const newProduct = await postData("/produits", {
          name,
          description,
          price,
          category_id: categoryId,
        });
        setProduits((prev) => [...prev, newProduct]);
      }

      // Réinitialiser le formulaire
      setProductForm({
        id: null,
        name: "",
        description: "",
        price: "",
        categoryId: "",
      });
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
    }
  };

  // Préparer le formulaire pour la mise à jour
  const handleEdit = (produit) => {
    setProductForm({
      id: produit.id,
      name: produit.name,
      description: produit.description,
      price: produit.price,
      categoryId: produit.categories.id,
    });
  };

  // Supprimer un produit
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    try {
      await deleteData(`/produits/${id}`);
      setProduits((prev) => prev.filter((prod) => prod.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
  };

  if (loading) return <div className="text-center mt-4">Chargement...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="mx-56 p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Produits</h1>

      {/* Formulaire */}
      <form onSubmit={handleFormSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Nom du produit"
          value={productForm.name}
          onChange={(e) =>
            setProductForm((prev) => ({ ...prev, name: e.target.value }))
          }
          className="p-2 border border-gray-300 rounded w-full mb-2"
        />
        <textarea
          placeholder="Description"
          value={productForm.description}
          onChange={(e) =>
            setProductForm((prev) => ({ ...prev, description: e.target.value }))
          }
          className="p-2 border border-gray-300 rounded w-full mb-2"
        />
        <input
          type="number"
          placeholder="Prix"
          value={productForm.price}
          onChange={(e) =>
            setProductForm((prev) => ({ ...prev, price: e.target.value }))
          }
          className="p-2 border border-gray-300 rounded w-full mb-2"
        />
        <select
          value={productForm.categoryId}
          onChange={(e) =>
            setProductForm((prev) => ({ ...prev, categoryId: e.target.value }))
          }
          className="p-2 border border-gray-300 rounded w-full mb-2"
        >
          <option value="">Choisir une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {productForm.id ? "Mettre à jour" : "Ajouter"}
        </button>
      </form>

      {/* Barre de recherche */}
      <input
        type="text"
        className="p-2 border border-gray-300 rounded w-full mb-4"
        placeholder="Rechercher un produit..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Tableau des produits */}
      {paginatedProduits.length > 0 ? (
        <ProductsTable
          produits={paginatedProduits}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="text-gray-500">Aucun produit disponible.</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 border rounded ${
                index + 1 === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductsTable = ({ produits, onEdit, onDelete }) => {
  return (
    <table className="min-w-full border-collapse border border-gray-300 mt-4">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">Nom</th>
          <th className="border border-gray-300 px-4 py-2">Description</th>
          <th className="border border-gray-300 px-4 py-2">Prix</th>
          <th className="border border-gray-300 px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {produits.map((produit) => (
          <tr key={produit.id}>
            <td className="border border-gray-300 px-4 py-2">{produit.name}</td>
            <td className="border border-gray-300 px-4 py-2">
              {produit.description}
            </td>
            <td className="border border-gray-300 px-4 py-2">{produit.price} €</td>
            <td className="border border-gray-300 px-4 py-2">
              <button
                className="text-blue-500 hover:underline mr-2"
                onClick={() => onEdit(produit)}
              >
                Modifier
              </button>
              <button
                className="text-red-500 hover:underline"
                onClick={() => onDelete(produit.id)}
              >
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Listproduits;
