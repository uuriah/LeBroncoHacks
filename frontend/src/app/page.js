'use client';

import { useRouter } from 'next/navigation';
import { Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const packTypes = [
  { 
    id: 'standard', 
    name: 'Standard Pack', 
    cardCount: 5, 
    description: 'Contains 5 random items with at least one rare or better item guaranteed.', 
    price: '100 Tokens',
    color: 'bg-blue-500'
  },
  { 
    id: 'premium', 
    name: 'Premium Pack', 
    cardCount: 5, 
    description: 'Contains 5 random items with at least one epic or better item guaranteed.', 
    price: '250 Tokens',
    color: 'bg-purple-500'
  },
  { 
    id: 'ultimate', 
    name: 'Ultimate Pack', 
    cardCount: 5, 
    description: 'Contains 5 random items with one legendary item guaranteed.', 
    price: '500 Tokens',
    color: 'bg-yellow-500'
  }
];

export default function PacksPage() {
  const router = useRouter();
  
  const handleOpenPack = (packId) => {
    // In a real app, you'd call an API to "purchase" the pack first
    // and then redirect to the opening page
    router.push('/packs/open');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Item Packs</h1>
          <p className="text-lg text-gray-600">Select a pack to open and discover exclusive clothing items!</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {packTypes.map((pack) => (
            <div
              key={pack.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 transition-transform duration-300"
            >
              <div className={`h-2 ${pack.color}`}></div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Package className={`w-6 h-6 ${pack.id === 'ultimate' ? 'text-yellow-500' : pack.id === 'premium' ? 'text-purple-500' : 'text-blue-500'}`} />
                  <h2 className="text-xl font-bold ml-2">{pack.name}</h2>
                </div>
                
                <p className="text-gray-600 mb-6">{pack.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{pack.price}</span>
                  <button
                    onClick={() => handleOpenPack(pack.id)}
                    className={`px-4 py-2 rounded-lg text-white flex items-center ${
                      pack.id === 'ultimate' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                      pack.id === 'premium' ? 'bg-purple-500 hover:bg-purple-600' : 
                      'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    Open Pack
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex justify-center gap-8">
          <Link href="/tokens">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg">
              Buy More Tokens
            </button>
          </Link>
          <Link href="/donate">
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg">
              Donate Clothes
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}