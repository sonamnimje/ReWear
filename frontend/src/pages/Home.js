import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { itemsAPI } from '../services/api';
import { Search, ChevronRight, User, Heart, ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories', 'Bags', 'Jewelry'
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data: allItems } = useQuery(
    ['all-items'],
    () => itemsAPI.getAll({ search: searchTerm }),
    { staleTime: 5 * 60 * 1000 }
  );

  const handleLogout = () => {
    // Clear auth state (e.g., remove token, clear user)
    logout();
    localStorage.removeItem('token');
    // Redirect to login
    navigate('/login');
  };

  return (
    <div
      className="min-h-screen font-body relative"
      style={{
        backgroundImage: "url('/carousel1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/70 z-0" />
      <div className="relative z-10">
        {/* Header */}
        <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between relative">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="ReWear Logo" className="h-10 w-10 object-contain" />
            <span className="text-5xl font-headline font-extrabold text-eco">ReWear</span>
          </div>
          {/* Centered Navigation */}
          <nav className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-14">
            <Link to="/home" className="text-2xl text-charcoal hover:text-eco font-bold">Home</Link>
            <Link to="/dashboard" className="text-2xl text-charcoal hover:text-eco font-bold">Dashboard</Link>
            <Link to="/items" className="text-2xl text-charcoal hover:text-eco font-bold">Browse</Link>
            <Link to="/items/1" className="text-2xl text-charcoal hover:text-eco font-bold">Item Detail</Link>
          </nav>
          {/* User Actions on Right */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {/* <Link to="/profile" className="text-charcoal hover:text-eco font-bold">Profile</Link> */}
                {/* Logout button will be moved below to the right of Bag */}
              </>
            ) : (
              <>
                <Link to="/login" className="text-2xl text-charcoal hover:text-eco font-bold">Login</Link>
                <Link to="/register" className="text-2xl text-white font-bold bg-eco border border-eco px-6 py-3 rounded hover:bg-accent">Sign Up</Link>
              </>
            )}
            {/* Icons Group */}
            <div className="flex items-center space-x-8 ml-8">
              <Link to="/profile" className="flex flex-col items-center text-charcoal hover:text-eco">
                <User className="h-9 w-9 mb-1" />
                <span className="text-xl font-semibold">Profile</span>
              </Link>
              <Link to="/wishlist" className="flex flex-col items-center text-charcoal hover:text-eco">
                <Heart className="h-9 w-9 mb-1" />
                <span className="text-xl font-semibold">Wishlist</span>
              </Link>
              <Link to="/bag" className="flex flex-col items-center text-charcoal hover:text-eco">
                <ShoppingBag className="h-9 w-9 mb-1" />
                <span className="text-xl font-semibold">Bag</span>
              </Link>
              {user && (
                <button onClick={handleLogout} className="flex flex-col items-center text-charcoal hover:text-red-600 focus:outline-none">
                  <LogOut className="h-9 w-9 mb-1" />
                  <span className="text-xl font-semibold mt-1">Logout</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="w-full mt-8 px-8">
          <div className="flex items-center bg-white rounded-lg shadow px-6 py-4">
            <Search className="h-8 w-8 text-eco mr-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search for clothing, brands, or categories..."
              className="flex-1 bg-transparent outline-none text-2xl text-charcoal font-body"
            />
          </div>
        </div>

        {/* Image Carousel / Banner */}
        <div className="w-full mt-8 px-8">
          <div className="w-full aspect-[3393/1497] rounded-xl flex items-center justify-center overflow-hidden relative border-4 border-white shadow-lg">
            <img
              src="/Banner.png"
              alt="ReWear. Reuse. Relove. Swap your clothes, not the planet."
              className="w-full h-full object-contain rounded-lg"
              style={{ filter: 'brightness(0.9)' }}
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="w-full mt-12 px-8">
          <h2 className="text-5xl font-headline font-bold text-charcoal mb-6 flex items-center gap-3 ml-4">
            <ChevronRight className="h-8 w-8 text-eco" /> Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 ml-4">
            {categories.map((cat, idx) => {
              let icon = '';
              let isImageIcon = false;
              switch (cat) {
                case 'Tops':
                  icon = '👕';
                  break;
                case 'Bottoms':
                  icon = '👖';
                  break;
                case 'Dresses':
                  icon = '👗';
                  break;
                case 'Outerwear':
                case 'Jackets':
                  icon = '🧥';
                  break;
                case 'Shoes':
                  icon = '👟';
                  break;
                case 'Accessories':
                  icon = '/accessory-icon.png'; // Use this path for the image in public
                  isImageIcon = true;
                  break;
                case 'Bags':
                  icon = '👜';
                  break;
                case 'Jewelry':
                  icon = '💍';
                  break;
                default:
                  icon = '👚';
              }
              return (
                <Link
                  to={`/items?category=${cat}`}
                  key={cat}
                  className="bg-white rounded-lg shadow flex items-center justify-center h-32 font-bold text-2xl text-charcoal hover:bg-eco/10 hover:text-eco transition"
                >
                  {isImageIcon ? (
                    <img src={icon} alt="Accessories" className="mr-3 h-12 w-12 inline-block" />
                  ) : (
                    <span className="mr-3 text-4xl">{icon}</span>
                  )}
                  {cat}
                  <ChevronRight className="ml-3 h-7 w-7 text-accent" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Product Listings Section */}
        <div className="w-full mt-12 px-8 mb-16">
          <h2 className="text-5xl font-headline font-bold text-charcoal mb-6 flex items-center gap-3 ml-4">
            <ChevronRight className="h-8 w-8 text-eco" /> Product Listings
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {allItems && allItems.length > 0 ? (
              allItems.slice(0, 8).map(item => (
                <Link
                  to={`/items/${item.id}`}
                  key={item.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition flex flex-col h-40 flex items-center justify-center"
                >
                  <div className="aspect-square bg-base rounded-t-lg flex items-center justify-center overflow-hidden">
                    {item.image_urls ? (
                      <img
                        src={JSON.parse(item.image_urls)[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-charcoal/40 text-2xl">No Image</span>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-headline font-semibold text-2xl text-charcoal mb-2 line-clamp-1">{item.title}</h3>
                    <p className="font-body text-xl text-charcoal/80 mb-3 line-clamp-2">{item.description}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="badge badge-primary text-xl bg-eco text-white">{item.price_points} pts</span>
                      <span className="text-xl text-charcoal/60">{item.category}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-charcoal/40 py-12 text-3xl">No items found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 