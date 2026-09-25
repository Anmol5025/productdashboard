import axios from 'axios';
import Cookies from 'js-cookie';

export const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // You could handle global errors here (e.g., toast notification)
    if (error.response?.status === 401) {
      // Auto logout if 401 unauthorized
      Cookies.remove('token', { path: '/' });
      Cookies.remove('user', { path: '/' });
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
