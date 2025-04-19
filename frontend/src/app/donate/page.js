'use client'
import Image from "next/image";
import { useState } from "react";

export default function Donate() {
  const [formData, setFormData] = useState({
    item: "",
    size: "",
    gender: "",
    image: null,
  });
  const [priceResult, setPriceResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    try {
      const response = await fetch("http://localhost:8080/api/price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: formData.item }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Average price:", result.average_price);
      setPriceResult(result.average_price);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20">
      <h1 className="text-2xl font-bold mb-8">Donate Clothes</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        {/* Clothing Item Input */}
        <div className="flex flex-col">
          <label htmlFor="item_name" className="mb-1 text-sm font-medium text-gray-700">Item</label>
          <input
            id="item_name"
            name="item"
            type="text"
            value={formData.item || ""}
            onChange={handleInputChange}
            placeholder="E.g Men's 501 Levis"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium mb-2">
            Clothing Size
          </label>
          <select
            id="size"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          >
            <option value="" disabled>
              Select size
            </option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>

        {/* Gender Input */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium mb-2">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          >
            <option value="" disabled>
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
        
        {/* Display price result */}
        {priceResult !== null && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-center font-medium">
              Average price: ${priceResult}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}