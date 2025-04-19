'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import './pack-animations.css';

// Example card data - in a real app, this would come from your database
const exampleCards = [
  { id: 1, rarity: 'common', name: 'Basic T-Shirt', image: '/images/tshirt.jpg', tokenValue: 5 },
  { id: 2, rarity: 'rare', name: 'Designer Dress', image: '/images/dress.jpg', tokenValue: 15 },
  { id: 3, rarity: 'epic', name: 'Luxury Watch', image: '/images/watch.jpg', tokenValue: 30 },
  { id: 4, rarity: 'uncommon', name: 'Vintage Jacket', image: '/images/jacket.jpg', tokenValue: 10 },
  { id: 5, rarity: 'legendary', name: 'Limited Edition Shoes', image: '/images/shoes.jpg', tokenValue: 50 },
];

// Define rarity colors
const rarityColors = {
  common: 'bg-gray-400',
  uncommon: 'bg-green-400',
  rare: 'bg-blue-400',
  epic: 'bg-purple-400',
  legendary: 'bg-yellow-400'
};

export default function OpenPack() {
  const [packOpened, setPackOpened] = useState(false);
  const [packAnimating, setPackAnimating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [showAllCards, setShowAllCards] = useState(false);
  const [direction, setDirection] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const packRef = useRef(null);
  
  // Minimum swipe distance required (in px)
  const minSwipeDistance = 50;
  
  // Initialize with cards from the pack (simulated)
  useEffect(() => {
    // In a real app, you would fetch the cards from an API
    // For now, we'll use the example cards
    setCards(exampleCards);
  }, []);

  const openPack = () => {
    if (packAnimating) return;
    
    setPackAnimating(true);
    
    // Add opening class to start animation
    if (packRef.current) {
      packRef.current.classList.add('opening');
    }
    
    // Wait for animation to complete before showing cards
    setTimeout(() => {
      setPackOpened(true);
      setPackAnimating(false);
    }, 1500); // Animation duration
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setDirection('right');
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex + 1);
      }, 300);
    } else {
      // Reached the end of the cards
      setShowAllCards(true);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setDirection('left');
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex - 1);
      }, 300);
    }
  };
  
  // Reset direction after animation completes
  useEffect(() => {
    if (direction) {
      const timer = setTimeout(() => {
        setDirection(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [direction]);
  
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextCard();
    }
    if (isRightSwipe) {
      prevCard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {!packOpened ? (
        // Pack opening screen
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Open Your Pack</h1>
          
          {/* Pack animation */}
          <div className="pack-container">
            <div 
              ref={packRef}
              className="pack"
              onClick={() => !packAnimating && openPack()}
            >
              <div className="pack-front">
                <div className="pack-shine"></div>
                <div className="pack-logo">
                  <div>CARBON</div>
                  <div>CLOSET</div>
                  <div className="text-sm mt-2">Premium Pack</div>
                </div>
              </div>
              <div className="pack-back">
                <div className="text-white text-center text-lg">
                  <div className="mb-2">✨</div>
                  <div>Opening...</div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="mt-6 text-center text-gray-600">
            Contains 5 random clothing items with different rarities
          </p>
          
          <button 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mx-auto block"
            onClick={openPack}
            disabled={packAnimating}
          >
            {packAnimating ? 'Opening...' : 'Click to Open'}
          </button>
        </div>
      ) : showAllCards ? (
        // Show all cards screen after viewing individually
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Your Collection Items</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <div 
                key={card.id} 
                className={`card-reveal bg-white rounded-lg shadow-md overflow-hidden ${
                  card.rarity === 'legendary' ? 'rarity-legendary' : 
                  card.rarity === 'epic' ? 'rarity-epic' : 
                  card.rarity === 'rare' ? 'rarity-rare' : 
                  card.rarity === 'uncommon' ? 'rarity-uncommon' : 
                  'rarity-common'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-2 ${rarityColors[card.rarity]}`}></div>
                <div className="p-4">
                  <div className="relative">
                    <img 
                      src={card.image} 
                      alt={card.name} 
                      className="w-full h-48 object-cover rounded-md mb-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                    {card.rarity === 'legendary' && <div className="card-shine"></div>}
                  </div>
                  <h2 className="text-lg font-semibold">{card.name}</h2>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize text-white ${rarityColors[card.rarity]}`}>
                      {card.rarity}
                    </span>
                    <span className="text-yellow-600 font-bold">{card.tokenValue} tokens</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Dashboard
              </button>
            </Link>
            
            <Link href="/packs">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg">
                Open Another Pack
              </button>
            </Link>
          </div>
        </div>
      ) : (
        // Card swipe view
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Card {currentCardIndex + 1} of {cards.length}
          </h1>
          
          <div 
            className="swipe-container"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div 
              className={`card-reveal ${
                cards[currentCardIndex].rarity === 'legendary' ? 'card-glow' : ''
              } ${
                direction === 'left' ? 'card-swipe-left' : 
                direction === 'right' ? 'card-swipe-right' : ''
              }`}
            >
              <div className={`bg-white rounded-xl shadow-xl overflow-hidden relative ${
                cards[currentCardIndex].rarity === 'legendary' ? 'rarity-legendary' : 
                cards[currentCardIndex].rarity === 'epic' ? 'rarity-epic' : 
                cards[currentCardIndex].rarity === 'rare' ? 'rarity-rare' : 
                cards[currentCardIndex].rarity === 'uncommon' ? 'rarity-uncommon' : 
                'rarity-common'
              }`}>
                <div className={`h-3 ${rarityColors[cards[currentCardIndex].rarity]}`}></div>
                <div className="p-6">
                  <div className="relative">
                    <img 
                      src={cards[currentCardIndex].image} 
                      alt={cards[currentCardIndex].name} 
                      className="w-full h-64 object-cover rounded-lg mb-6"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                    <div className="card-shine"></div>
                  </div>
                  
                  <div className="animate-fadeIn">
                    <h2 className="text-2xl font-bold mb-2">{cards[currentCardIndex].name}</h2>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full text-white capitalize ${rarityColors[cards[currentCardIndex].rarity]}`}>
                        {cards[currentCardIndex].rarity}
                      </span>
                      <span className="text-yellow-600 font-bold text-xl">
                        {cards[currentCardIndex].tokenValue} tokens
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Touch swipe indicators */}
          <div className="relative mt-8">
            <div className="flex justify-between">
              <button
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                className={`p-3 rounded-full ${
                  currentCardIndex === 0 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white transition-colors`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextCard}
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            {/* Swipe instructions */}
            <p className="text-center text-gray-500 text-sm mt-4">
              Swipe left or right to navigate
            </p>
          </div>
          
          {/* View all button */}
          <button
            onClick={() => setShowAllCards(true)}
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg flex items-center mx-auto"
          >
            View All Cards
          </button>
        </div>
      )}
    </div>
  );
}