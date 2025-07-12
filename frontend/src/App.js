import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useQuery } from 'react-query';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import ItemDetail from './pages/ItemDetail';
import AddItem from './pages/AddItem';
import Profile from './pages/Profile';
import Exchanges from './pages/Exchanges';
import Chat from './pages/Chat';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { api } from './services/api';

function AppContent() {
  const { user, loading } = useAuth();

  // Check if user is authenticated
  const { data: userData } = useQuery(
    ['user'],
    () => api.get('/auth/me').then(res => res.data),
    {
      enabled: !!user,
      retry: false,
      onError: () => {
        // Token is invalid, clear user
        localStorage.removeItem('token');
        window.location.reload();
      }
    }
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/items" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/admin" element={<AdminPanel />} />
          {/* Protected routes */}
          {user && (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-item" element={<AddItem />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/exchanges" element={<Exchanges />} />
              <Route path="/chat" element={<Chat />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      {/* Removed logo image from here */}
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
}

export default App; 