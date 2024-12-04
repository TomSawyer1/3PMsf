import React, { useEffect, useState } from "react";
import { fetchData } from "../api/api";

const Listproduits = () => {
  //jaffiche all produit
  const [produits, setProduits] = useState([]); // Liste complète des produits deppuis la bdd
// jaffiche quelque chose de filtrer
  const [filteredProduits, setFilteredProduits] = useState([]); // Produits filtrés pour recherche et tri



  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [error, setError] = useState(null); // Gestion des erreurs


  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche de l'user
      // sa recherche   --- recuperation user


  const [sortKey, setSortKey] = useState("price"); // Clé de tri
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle pour la pagination
  const itemsPerPage = 5; // 5 elements dans une page

  // Charger les produits depuis l'API
  useEffect(() => {
    fetchData("/produits")
      .then((response) => {
        setProduits(response);
        setFilteredProduits(response);
        setLoading(false);
      })
      .catch((error) => {
        setError("Erreur lors de la récupération des produits");
        console.error(error);
        setLoading(false);
      });
  }, []);

  // Filtrer les produits par recherche
  useEffect(() => {
    const filtered = produits.filter((produit) =>
      produit.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProduits(filtered);
    setCurrentPage(1); // Revenir à la première page après filtrage
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

  // Affichage en cas de chargement
  if (loading) return <div className="text-center mt-4">Chargement...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="mx-56 p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Produits</h1>

      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded w-full"
          placeholder="Rechercher un produit..."
          value={searchTerm} // ce que l'user a tapez
          onChange={(e) => setSearchTerm(e.target.value)} // lorsque la valeur change on appel la fonction
        />
      </div>

      {/* Menu de tri */}
      <div className="mb-4">
        <label htmlFor="sort" className="mr-2 font-medium">Trier par :</label>
        <select
          id="sort"
          className="p-2 border border-gray-300 rounded"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="price">Prix</option>
          <option value="name">Nom</option>
        </select>
      </div>

      {/* Tableau des produits */}
      {paginatedProduits.length > 0 ? (
        <ProductsTable produits={paginatedProduits} />
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

// Composant réutilisable pour afficher le tableau des produits
const ProductsTable = ({ produits }) => {
  return (
    <table className="min-w-full border-collapse border border-gray-300 mt-4">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">Nom</th>
          <th className="border border-gray-300 px-4 py-2">Description</th>
          <th className="border border-gray-300 px-4 py-2">Prix</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Listproduits;