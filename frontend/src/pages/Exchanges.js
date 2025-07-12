import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { exchangesAPI } from '../services/api';
import { 
  RefreshCw, 
  CheckCircle, 
  X, 
  Clock, 
  Award,
  Package,
  User,
  Calendar,
  MessageCircle,
  Filter,
  Search
} from 'lucide-react';
import Navbar from '../components/Navbar';

const Exchanges = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: exchanges, isLoading } = useQuery(
    ['my-exchanges'],
    () => exchangesAPI.getMyExchanges(),
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  const acceptMutation = useMutation(
    (id) => exchangesAPI.accept(id),
    {
      onSuccess: () => {
        toast.success('Exchange accepted!');
        queryClient.invalidateQueries(['my-exchanges']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to accept exchange');
      },
    }
  );

  const rejectMutation = useMutation(
    (id) => exchangesAPI.reject(id),
    {
      onSuccess: () => {
        toast.success('Exchange rejected');
        queryClient.invalidateQueries(['my-exchanges']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to reject exchange');
      },
    }
  );

  const completeMutation = useMutation(
    (id) => exchangesAPI.complete(id),
    {
      onSuccess: () => {
        toast.success('Exchange completed!');
        queryClient.invalidateQueries(['my-exchanges']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to complete exchange');
      },
    }
  );

  const cancelMutation = useMutation(
    (id) => exchangesAPI.cancel(id),
    {
      onSuccess: () => {
        toast.success('Exchange cancelled');
        queryClient.invalidateQueries(['my-exchanges']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to cancel exchange');
      },
    }
  );

  const filteredExchanges = exchanges?.filter(exchange => {
    const matchesStatus = statusFilter === 'all' || exchange.status === statusFilter;
    const matchesSearch = !searchTerm || 
      exchange.item?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exchange.other_user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exchange.other_user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  }) || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <Award className="h-5 w-5 text-green-500" />;
      case 'rejected':
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canAccept = (exchange) => {
    return exchange.status === 'pending' && exchange.is_recipient;
  };

  const canReject = (exchange) => {
    return exchange.status === 'pending';
  };

  const canComplete = (exchange) => {
    return exchange.status === 'accepted';
  };

  const canCancel = (exchange) => {
    return exchange.status === 'pending' || exchange.status === 'accepted';
  };

  return (
    <div className="min-h-screen bg-base font-body py-8">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-headline font-bold text-eco">My Exchanges</h1>
          <p className="font-body text-charcoal/80">Manage your clothing exchanges</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search exchanges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {filteredExchanges.length} exchanges
              </span>
            </div>
          </div>
        </div>

        {/* Exchanges List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredExchanges.length > 0 ? (
          <div className="space-y-4">
            {filteredExchanges.map((exchange) => (
              <div key={exchange.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start space-x-4">
                  {/* Item Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {exchange.item?.image_urls ? (
                      <img 
                        src={JSON.parse(exchange.item.image_urls)[0]} 
                        alt={exchange.item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Exchange Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {exchange.item?.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Exchange with{' '}
                          <span className="font-medium">
                            {exchange.other_user?.firstName} {exchange.other_user?.lastName}
                          </span>
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(exchange.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-1" />
                            {exchange.exchange_type === 'swap' ? 'Swap' : 'Points'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {getStatusIcon(exchange.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exchange.status)}`}>
                          {exchange.status}
                        </span>
                      </div>
                    </div>

                    {/* Exchange Message */}
                    {exchange.message && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700">{exchange.message}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      {canAccept(exchange) && (
                        <button
                          onClick={() => acceptMutation.mutate(exchange.id)}
                          disabled={acceptMutation.isLoading}
                          className="btn-primary text-sm"
                        >
                          {acceptMutation.isLoading ? 'Accepting...' : 'Accept'}
                        </button>
                      )}

                      {canReject(exchange) && (
                        <button
                          onClick={() => rejectMutation.mutate(exchange.id)}
                          disabled={rejectMutation.isLoading}
                          className="btn-secondary text-sm"
                        >
                          {rejectMutation.isLoading ? 'Rejecting...' : 'Reject'}
                        </button>
                      )}

                      {canComplete(exchange) && (
                        <button
                          onClick={() => completeMutation.mutate(exchange.id)}
                          disabled={completeMutation.isLoading}
                          className="btn-primary text-sm"
                        >
                          {completeMutation.isLoading ? 'Completing...' : 'Complete'}
                        </button>
                      )}

                      {canCancel(exchange) && (
                        <button
                          onClick={() => cancelMutation.mutate(exchange.id)}
                          disabled={cancelMutation.isLoading}
                          className="btn-secondary text-sm"
                        >
                          {cancelMutation.isLoading ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}

                      <Link
                        to={`/items/${exchange.item?.id}`}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        View Item
                      </Link>

                      <button className="text-gray-600 hover:text-gray-700 text-sm font-medium flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <RefreshCw className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exchanges found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search criteria'
                : 'You haven\'t made any exchanges yet'
              }
            </p>
            <Link to="/items" className="btn-primary">
              Browse Items
            </Link>
          </div>
        )}

        {/* Exchange Statistics */}
        {exchanges && exchanges.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exchange Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {exchanges.filter(e => e.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {exchanges.filter(e => e.status === 'accepted').length}
                </div>
                <div className="text-sm text-gray-600">Accepted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {exchanges.filter(e => e.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {exchanges.filter(e => e.status === 'rejected' || e.status === 'cancelled').length}
                </div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exchanges; 