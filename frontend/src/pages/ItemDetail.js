import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// import { useQuery } from 'react-query';
// import { itemsAPI } from '../services/api';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';

const hardcodedProducts = [
  {
    id: '1',
    title: 'Eco Denim Jacket',
    description: 'A stylish jacket made from recycled denim. Perfect for eco-conscious fashion lovers!',
    image_urls: '["/denimjackect.png"]',
    category: 'Jackets',
    price_points: 25
  },
  {
    id: '2',
    title: 'Organic Cotton Tee',
    description: 'Soft, breathable, and made from 100% organic cotton.',
    image_urls: '["/top.png"]',
    category: 'T-Shirts',
    price_points: 12
  },
  {
    id: '3',
    title: 'Recycled Tote Bag',
    description: 'Carry your essentials in style with this eco-friendly tote bag.',
    image_urls: '["/bagss.png"]',
    category: 'Bags',
    price_points: 8
  }
];

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  // const { data: item, isLoading } = useQuery(
  //   ['item', id],
  //   () => itemsAPI.getById(id),
  //   { staleTime: 5 * 60 * 1000 }
  // );

  // Use hardcoded product instead of fetched item
  const item = hardcodedProducts.find(p => p.id === id);
  const images = item?.image_urls ? JSON.parse(item.image_urls) : [];

  if (!item) {
    return (
      <div className="min-h-screen bg-base font-body flex flex-col items-center justify-center">
        <Navbar />
        <div className="text-2xl text-red-500 font-bold mt-20">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base font-body">
      <Navbar />

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="flex items-center bg-white rounded-lg shadow px-4 py-2">
          <Search className="h-5 w-5 text-eco mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search for clothing, brands, or categories..."
            className="flex-1 bg-transparent outline-none text-charcoal font-body"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto mt-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-square bg-base rounded-xl flex items-center justify-center overflow-hidden">
              {images.length > 0 ? (
                <img src={images[0]} alt={item?.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-charcoal/40 text-lg">No Image</span>
              )}
            </div>
          </div>
          {/* Product Info */}
          <div>
            <div className="bg-white rounded-xl shadow p-6 mb-4">
              <h1 className="text-2xl font-headline font-bold text-eco mb-2">{item?.title || 'Product name'}</h1>
              <p className="font-body text-charcoal/80 mb-4">{item?.description || 'Product description goes here.'}</p>
              <div className="flex items-center space-x-4 mt-4">
                <span className="badge badge-primary text-xs bg-eco text-white">{item?.category}</span>
                <span className="text-xs text-charcoal/60">{item?.price_points} pts</span>
              </div>
            </div>
          </div>
        </div>
        {/* Product Images Thumbnails */}
        <div className="mt-8">
          <h2 className="text-md font-headline font-semibold text-charcoal mb-2">Product Images</h2>
          <div className="flex space-x-4">
            {images.length > 0 ? (
              images.map((img, idx) => (
                <div key={idx} className="w-28 h-36 bg-base rounded-lg overflow-hidden flex items-center justify-center">
                  <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              <div className="text-charcoal/40">No images available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail; 