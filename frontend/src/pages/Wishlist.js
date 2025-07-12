import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Wishlist = () => {
  const [wishlist] = useState([
    {
      id: 1,
      title: 'Eco Denim Jacket',
      image: '/denimjackect.png',
      price: '$25',
    },
    {
      id: 2,
      title: 'Organic Cotton Tee',
      image: '/top.png',
      price: '$12',
    },
  ]);

  return (
    <div className="min-h-screen bg-base font-body py-10 px-4">
      <Navbar />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">My Wishlist</h2>
        {wishlist.length === 0 ? (
          <div className="text-gray-400">Your wishlist is empty.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishlist.map(item => (
              <div key={item.id} className="bg-gray-100 rounded-lg p-4 flex gap-4 items-center">
                <div className="w-16 h-16 bg-white rounded flex items-center justify-center overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 