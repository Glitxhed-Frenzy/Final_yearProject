// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateDetails: (data) => api.put('/auth/updatedetails', data),
  updatePassword: (data) => api.put('/auth/updatepassword', data),
  verifyAndReset: (data) => api.post('/auth/verify-and-reset', data)
};

// Activity APIs
export const activityAPI = {
  getAll: () => api.get('/activities'),
  getById: (id) => api.get(`/activities/${id}`),
  create: (activityData) => api.post('/activities', activityData),
  update: (id, activityData) => api.put(`/activities/${id}`, activityData),
  delete: (id) => api.delete(`/activities/${id}`),
  getStats: () => api.get('/activities/stats')
};

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  impersonateUser: (id) => api.post(`/admin/users/${id}/impersonate`),
  getEmissionFactors: () => api.get('/admin/emission-factors'),
  createEmissionFactor: (data) => api.post('/admin/emission-factors', data),
  updateEmissionFactor: (id, data) => api.put(`/admin/emission-factors/${id}`, data),
  deleteEmissionFactor: (id) => api.delete(`/admin/emission-factors/${id}`)
};

// Mission APIs
export const missionAPI = {
  getMissions: () => api.get('/missions'),
  getLeaderboard: (type = 'all_time', limit = 50) => api.get(`/missions/leaderboard?type=${type}&limit=${limit}`)
};

// ========== LEADERBOARD APIs  ==========
export const leaderboardAPI = {
  getLeaderboard: (limit = 50) => api.get(`/leaderboard?limit=${limit}`),
  getUserHistory: () => api.get('/leaderboard/history')
};

export default api;