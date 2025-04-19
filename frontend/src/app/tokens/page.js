"use client";

import { useState } from "react";
import { Coins } from "lucide-react";

const bundles = [
  { id: 1, tokens: 50, price: "$5" },
  { id: 2, tokens: 100, price: "$9" },
  { id: 3, tokens: 250, price: "$20" },
  { id: 4, tokens: 500, price: "$35" },
];

export default function BuyTokensPage() {
  const [tokenBalance, setTokenBalance] = useState(100); // Example initial balance

  const handlePurchase = (tokens) => {
    setTokenBalance(tokenBalance + tokens); // Update token balance
    alert(`Successfully purchased ${tokens} tokens!`);
  };

  return (
    <div className="p-6 w-full mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Coins className="w-8 h-8 text-yellow-500" /> Buy Tokens
      </h1>

      {/* Current Token Balance */}
      <div className="mb-6">
        <p className="text-lg text-gray-700">
          Current Balance: <span className="font-bold">{tokenBalance} Tokens</span>
        </p>
      </div>

      {/* Token Bundles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            <p className="text-lg font-bold text-gray-800">{bundle.tokens} Tokens</p>
            <p className="text-gray-600 mb-4">{bundle.price}</p>
            <button
              onClick={() => handlePurchase(bundle.tokens)}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}