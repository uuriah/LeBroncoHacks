"use client";

const clothingItems = [
  { id: 1, name: "Men's T-Shirt", price: "$20", image: "/images/tshirt.jpg" },
  { id: 2, name: "Women's Dress", price: "$35", image: "/images/dress.jpg" },
  { id: 3, name: "Wrist Watch", price: "$50", image: "/images/watch.jpg" },
  { id: 4, name: "Men's Jacket", price: "$60", image: "/images/jacket.jpg" },
  { id: 5, name: "Women's Shoes", price: "$45", image: "/images/shoes.jpg" },
  { id: 6, name: "Hat", price: "$15", image: "/images/hat.jpg" },
];

export default function ShopPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Shop Clothing</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {clothingItems.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
              <p className="text-gray-600">{item.price}</p>
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