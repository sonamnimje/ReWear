import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  me: () => api.get('/auth/me'),
};

export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getFeatured: () => api.get('/items/featured'),
  getById: (id) => api.get(`/items/${id}`),
  create: (itemData) => api.post('/items/', itemData),
  update: (id, itemData) => api.put(`/items/${id}`, itemData),
  delete: (id) => api.delete(`/items/${id}`),
  uploadImage: (id, formData) => api.post(`/items/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const exchangesAPI = {
  getMyExchanges: () => api.get('/exchanges/my-exchanges'),
  create: (exchangeData) => api.post('/exchanges', exchangeData),
  accept: (id) => api.put(`/exchanges/${id}/accept`),
  reject: (id) => api.put(`/exchanges/${id}/reject`),
  complete: (id) => api.put(`/exchanges/${id}/complete`),
  cancel: (id) => api.put(`/exchanges/${id}/cancel`),
};

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getStats: () => api.get('/users/stats'),
  getMyItems: () => api.get('/users/my-items'),
  getByUsername: (username) => api.get(`/users/${username}`),
};

export const chatAPI = {
  sendMessage: (message) => api.post('/chat/send', { message }),
  getHistory: (limit) => api.get('/chat/history', { params: { limit } }),
  getSuggestions: () => api.get('/chat/suggestions'),
}; 