import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white fixed top-0 left-0 w-full shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="text-2xl font-bold">
            3PM's
          </a>
          <div className="hidden md:flex space-x-4">
            <a href="/categories" className="hover:bg-blue-700 px-3 py-2 rounded-md">
              Catégories
            </a>
            <a href="/produits" className="hover:bg-blue-700 px-3 py-2 rounded-md">
              Produits
            </a>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden bg-blue-700 space-y-2">
            <a href="/categories" className="block px-4 py-2 hover:bg-blue-800">
              Catégories
            </a>
            <a href="/produits" className="block px-4 py-2 hover:bg-blue-800">
              Produits
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;