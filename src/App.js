import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Main from './components/Main';
import Listcategories from './components/Listcategories'; 
import Listproduits from './components/Listproduits'; 

const App = () => {
  return (
    <Router>
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/categories" element={<Listcategories />} />
          <Route path="/produits" element={<Listproduits />} />
          <Route path="/" element={<Main /> } />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
