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
  updatePassword: (data) => api.put('/auth/updatepassword', data)
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

// Admin APIs - ADD THIS SECTION
export const adminAPI = {
  // Dashboard stats - KEEP THIS
  getStats: () => api.get('/admin/stats'),
  
  // Users management
  getUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  impersonateUser: (id) => api.post(`/admin/users/${id}/impersonate`),
  
  // Emission factors
  getEmissionFactors: () => api.get('/admin/emission-factors'),
  createEmissionFactor: (data) => api.post('/admin/emission-factors', data),
  updateEmissionFactor: (id, data) => api.put(`/admin/emission-factors/${id}`, data),
  deleteEmissionFactor: (id) => api.delete(`/admin/emission-factors/${id}`)
};

// Export the api instance as default
export default api;