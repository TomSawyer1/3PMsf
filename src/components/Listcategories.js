import React, { useEffect, useState } from 'react';
import { fetchData, postData, deleteData, updateData  } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';

const Listcategories = () => {
  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [updatedCategoryName, setUpdatedCategoryName] = useState('');


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await fetchData('/categories');
        setCategories(categoriesResponse);

        const produitsResponse = await fetchData('/produits');
        setProduits(produitsResponse);

        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des données');
        console.error(err);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
      setFilteredProduits([]);
    } else {
      const filtered = produits.filter(
        (produit) => produit.categories.id === categoryId
      );
      setFilteredProduits(filtered);
      setSelectedCategoryId(categoryId);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Le nom de la catégorie est requis.');
      return;
    }

    try {
      const newCategory = await postData('/categories', { name: newCategoryName });
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie :', error);
    }
  };
// delelete
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette catégorie et tous ses produits ?')) {
      return;
    }

    try {
      await deleteData(`/categories/${categoryId}`);
      setCategories(categories.filter((category) => category.id !== categoryId));
      setProduits(produits.filter((produit) => produit.categories.id !== categoryId));
      setFilteredProduits([]);
      setSelectedCategoryId(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie :', error);
    }
  };

  if (loading) return <div className="text-center mt-4">Chargement...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  // updte categorie

  const handleUpdateCategory = async (categoryId) => {
    if (!updatedCategoryName.trim()) {
      alert('Le nom de la catégorie est requis.');
      return;
    }
  
    try {
      const updatedCategory = await updateData(`/categories/${categoryId}`, {
        name: updatedCategoryName,
      });
  
      setCategories(categories.map((category) =>
        category.id === categoryId ? updatedCategory : category
      ));
  
      // Réinitialiser l'édition
      setEditingCategoryId(null);
      setUpdatedCategoryName('');
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie :", error);
    }
  };

  
  return (
    <div className="mx-56 p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Catégories</h1>

      {/* Formulaire pour ajouter une nouvelle catégorie */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="text"
          className="p-2 border border-gray-300 rounded w-full"
          placeholder="Nom de la nouvelle catégorie"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddCategory}
        >
          Ajouter la Catégorie
        </button>
      </motion.div>

      {/* Liste des catégories */}
      <ul className="space-y-4">
        <AnimatePresence>
        {categories.map((category) => (
  <motion.li
    key={category.id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="p-4 bg-gray-100 rounded shadow hover:bg-gray-200"
  >
    <div className="flex justify-between items-center">
      {editingCategoryId === category.id ? (
        // Formulaire d'édition
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="p-2 border border-gray-300 rounded"
            value={updatedCategoryName}
            onChange={(e) => setUpdatedCategoryName(e.target.value)}
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => handleUpdateCategory(category.id)}
          >
            Enregistrer
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => {
              setEditingCategoryId(null);
              setUpdatedCategoryName('');
            }}
          >
            Annuler
          </button>
        </div>
      ) : (
        // Affichage normal
        <>
          <span
            className="text-lg font-medium cursor-pointer"
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </span>
          <div className="flex gap-4">
            <button
              className="text-blue-500 hover:underline"
              onClick={() => {
                setEditingCategoryId(category.id);
                setUpdatedCategoryName(category.name);
              }}
            >
              Modifier
            </button>
            <button
              className="text-red-500 hover:underline"
              onClick={() => handleDeleteCategory(category.id)}
            >
              Supprimer
            </button>
          </div>
        </>
      )}
    </div>
    {/* Produits de la catégorie sélectionnée */}
    <AnimatePresence>
      {selectedCategoryId === category.id && (
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {filteredProduits.length > 0 ? (
            <ProductsTable produits={filteredProduits} />
          ) : (
            <div className="text-gray-500">Aucun produit disponible.</div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.li>
))}

        </AnimatePresence>
      </ul>
    </div>
  );
};

const ProductsTable = ({ produits }) => {
  return (
    <motion.table
      className="min-w-full border-collapse border border-gray-300 mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2">Nom</th>
          <th className="border border-gray-300 px-4 py-2">Description</th>
          <th className="border border-gray-300 px-4 py-2">Prix</th>
        </tr>
      </thead>
      <tbody>
        {produits.map((produit) => (
          <motion.tr
            key={produit.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <td className="border border-gray-300 px-4 py-2">{produit.name}</td>
            <td className="border border-gray-300 px-4 py-2">{produit.description}</td>
            <td className="border border-gray-300 px-4 py-2">{produit.price} €</td>
          </motion.tr>
        ))}
      </tbody>
    </motion.table>
  );
};

export default Listcategories;
