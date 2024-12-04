import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api"; // Assurez-vous que cette URL est correcte

// Recup les données en GET
export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la requête GET sur ${endpoint} :`, error);
    throw error;
  }
};

// Poster des données
export const postData = async (endpoint, data) => {
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la requête POST sur ${endpoint} :`, error);
    throw error;
  }
};

// Delete des données
export const deleteData = async (endpoint) => {
  try {
    const response = await axios.delete(`${BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la requête DELETE sur ${endpoint} :`, error);
    throw error;
  }
};

// put les données ( modifier )

export const updateData = async (endpoint, data) => {
  try {
    const response = await axios.put(`${BASE_URL}${endpoint}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la requête PUT sur ${endpoint} :`, error);
    throw error;
  }
};
