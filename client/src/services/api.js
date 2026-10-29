import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach JWT token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('workout_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept 401s to redirect or clear session if needed
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('workout_token');
        localStorage.removeItem('workout_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  resetPassword: (data) => API.post('/auth/reset-password', data),
};

export const workoutAPI = {
  getByDate: (date) => API.get(`/workouts/date/${date}`),
  saveLog: (data) => API.post('/workouts', data),
  getRecent: (limit = 30) => API.get(`/workouts/recent?limit=${limit}`),
  getStats: () => API.get('/workouts/stats'),
  deleteLog: (id) => API.delete(`/workouts/${id}`),
};

export const metricAPI = {
  getMetrics: () => API.get('/metrics'),
  logMetric: (data) => API.post('/metrics', data),
  deleteMetric: (id) => API.delete(`/metrics/${id}`),
};

export const exerciseAPI = {
  getExercises: () => API.get('/exercises'),
  createCustom: (data) => API.post('/exercises', data),
  deleteCustom: (id) => API.delete(`/exercises/${id}`),
};

export const planAPI = {
  getPlans: () => API.get('/plans'),
  createPlan: (data) => API.post('/plans', data),
  updatePlan: (id, data) => API.put(`/plans/${id}`, data),
  deletePlan: (id) => API.delete(`/plans/${id}`),
};

export default API;

