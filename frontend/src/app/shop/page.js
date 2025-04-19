"use client";
import { useState, useEffect } from "react";

export default function ShopPage() {
  const [clothingItems, setClothingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/listings");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setClothingItems(data);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Placeholder data with dummy images that will definitely exist
  const placeholderItems = [
    { id: 1, name: "Men's T-Shirt", price: "$20", image: "https://via.placeholder.com/300x400?text=T-Shirt" },
    { id: 2, name: "Women's Dress", price: "$35", image: "https://via.placeholder.com/300x400?text=Dress" },
    { id: 3, name: "Wrist Watch", price: "$50", image: "https://via.placeholder.com/300x400?text=Watch" },
    { id: 4, name: "Men's Jacket", price: "$60", image: "https://via.placeholder.com/300x400?text=Jacket" },
    { id: 5, name: "Women's Shoes", price: "$45", image: "https://via.placeholder.com/300x400?text=Shoes" },
    { id: 6, name: "Hat", price: "$15", image: "https://via.placeholder.com/300x400?text=Hat" },
  ];

  // If no real items, use placeholders
  const displayItems = clothingItems.length > 0 ? clothingItems : placeholderItems;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Shop Clothing</h1>
      
      {clothingItems.length === 0 && (
        <p className="text-gray-500 mb-6">No items available right now. Be the first to donate!</p>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="w-full h-48 relative">
              {/* Handle invalid image URLs gracefully */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
                }}
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
              <div className="flex justify-between mt-1">
                <p className="text-gray-600">{item.price}</p>
                {item.size && (
                  <p className="text-gray-600">Size: {item.size}</p>
                )}
              </div>
              {item.gender && (
                <p className="text-gray-500 text-sm mt-1">
                  {item.gender.charAt(0).toUpperCase() + item.gender.slice(1)}
                </p>
              )}
              <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}