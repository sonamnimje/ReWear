import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Heart, ShoppingBag, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
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
          <></>
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
  );
};

export default Navbar; 