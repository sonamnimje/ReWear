import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import { User, Edit2, Mail, Star, List, Repeat } from 'lucide-react';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [myExchanges, setMyExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for Wishlist and Bag
  const [wishlist, setWishlist] = useState([
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
  const [bag, setBag] = useState([
    {
      id: 3,
      title: 'Recycled Tote Bag',
      image: '/bagss.png',
      price: '$8',
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user's items
        const itemsRes = await itemsAPI.getAll({ owner_id: user?.id });
        setMyItems(Array.isArray(itemsRes) ? itemsRes : []);
        // Fetch user's exchanges (placeholder, implement API as needed)
        // const exchangesRes = await exchangesAPI.getUserExchanges(user?.id);
        setMyExchanges([]); // Placeholder
      } catch (err) {
        setMyItems([]);
        setMyExchanges([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg">Please log in to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base font-body py-10 px-4">
      <Navbar />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="flex flex-col items-center md:w-1/3">
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="h-16 w-16 text-gray-400" />
            )}
          </div>
          <div className="text-xl font-bold text-gray-800 mb-1">{user.full_name || user.username}</div>
          <div className="text-gray-500 text-sm flex items-center mb-2">
            <Mail className="h-4 w-4 mr-1" /> {user.email}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="font-semibold text-green-700">{user.points} pts</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition mb-2" disabled>
            <Edit2 className="h-4 w-4" /> Edit Profile
          </button>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-8">
          {/* My Listings */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <List className="h-5 w-5 text-blue-500" />
              <span className="text-lg font-semibold text-gray-800">My Listings</span>
            </div>
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : myItems.length === 0 ? (
              <div className="text-gray-400">1</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myItems.map(item => (
                  <Link to={`/items/${item.id}`} key={item.id} className="bg-gray-100 rounded-lg p-4 flex gap-4 items-center hover:bg-green-50 transition">
                    <div className="w-16 h-16 bg-white rounded flex items-center justify-center overflow-hidden">
                      {item.image_urls ? (
                        <img src={JSON.parse(item.image_urls)[0]} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.category}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* My Exchanges (placeholder) */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Repeat className="h-5 w-5 text-purple-500" />
              <span className="text-lg font-semibold text-gray-800">My Exchanges</span>
            </div>
            <div className="text-gray-400">0</div>
          </div>
          {/* Wishlist */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-pink-500" />
              <span className="text-lg font-semibold text-gray-800">Wishlist</span>
            </div>
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
          {/* Bag */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <List className="h-5 w-5 text-green-500" />
              <span className="text-lg font-semibold text-gray-800">Bag</span>
            </div>
            {bag.length === 0 ? (
              <div className="text-gray-400">Your bag is empty.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bag.map(item => (
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
      </div>
    </div>
  );
};

export default Profile; 