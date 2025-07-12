import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI, exchangesAPI } from '../services/api';
import { User } from 'lucide-react';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile } = useQuery(['profile'], () => usersAPI.getProfile(), { enabled: !!user });
  const { data: myItems } = useQuery(['my-items'], () => usersAPI.getMyItems(), { enabled: !!user });
  const { data: exchanges } = useQuery(['my-exchanges'], () => exchangesAPI.getMyExchanges(), { enabled: !!user });

  // Purchases: exchanges where user is recipient and status is completed
  const myPurchases = exchanges?.filter(ex => ex.status === 'completed' && ex.is_recipient) || [];

  return (
    <div className="min-h-screen bg-base font-body">
      <Navbar />

      <div className="max-w-6xl mx-auto mt-12 px-4">
        {/* Top Section: Avatar, Stats, Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Avatar */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="h-16 w-16 text-gray-400" />
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{profile?.firstName} {profile?.lastName}</h2>
            <p className="text-gray-600 text-sm mb-2">{profile?.email}</p>
          </div>
          {/* Stats */}
          <div className="col-span-2 flex flex-col justify-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-lg font-bold text-green-700">{profile?.points || 0}</div>
                <div className="text-xs text-gray-500">Points</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-lg font-bold text-blue-700">{myItems?.length || 0}</div>
                <div className="text-xs text-gray-500">Listings</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-lg font-bold text-purple-700">{myPurchases.length}</div>
                <div className="text-xs text-gray-500">Purchases</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-lg font-bold text-yellow-700">{exchanges?.length || 0}</div>
                <div className="text-xs text-gray-500">Total Exchanges</div>
              </div>
            </div>
            {/* Info Box */}
            <div className="bg-white rounded-lg shadow p-6 mt-2 min-h-[80px] flex items-center">
              <span className="text-gray-700 text-sm">{profile?.bio || 'Welcome to your dashboard! Here you can manage your listings, view your purchases, and track your activity.'}</span>
            </div>
          </div>
        </div>

        {/* My Listings */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">My Listings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {myItems && myItems.length > 0 ? (
              myItems.slice(0, 8).map(item => (
                <Link
                  to={`/items/${item.id}`}
                  key={item.id}
                  className="bg-white rounded-lg shadow flex flex-col hover:shadow-md transition"
                >
                  <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center overflow-hidden">
                    {item.image_urls ? (
                      <img src={JSON.parse(item.image_urls)[0]} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.title}</h4>
                    <span className="badge badge-primary text-xs">{item.price_points} pts</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-8">No listings yet.</div>
            )}
          </div>
        </div>

        {/* My Purchases */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">My Purchases</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {myPurchases && myPurchases.length > 0 ? (
              myPurchases.slice(0, 8).map(ex => (
                <Link
                  to={`/items/${ex.item?.id}`}
                  key={ex.id}
                  className="bg-white rounded-lg shadow flex flex-col hover:shadow-md transition"
                >
                  <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center overflow-hidden">
                    {ex.item?.image_urls ? (
                      <img src={JSON.parse(ex.item.image_urls)[0]} alt={ex.item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{ex.item?.title}</h4>
                    <span className="badge badge-primary text-xs">{ex.item?.price_points} pts</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-8">No purchases yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 