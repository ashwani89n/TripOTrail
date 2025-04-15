import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use(
  (config) => {
    const publicPaths = ['/auth/login', '/auth/register'];
    if (publicPaths.includes(config.url)) {
      return config;
    }

    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('token_expiry');
    const isTokenExpired = !expiry || Date.now() > parseInt(expiry);

    if(token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!token || isTokenExpired) {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiry');

      toast.error('Session expired. Please log in again.', {
        toastId: 'session-expired',
      });

      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);

      return Promise.reject(new Error('Token expired'));
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
