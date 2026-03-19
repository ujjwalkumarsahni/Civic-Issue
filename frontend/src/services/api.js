import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'कुछ गलत हो गया';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('कृपया फिर से लॉगिन करें');
    } else if (error.response?.status === 403) {
      toast.error('आपके पास अनुमति नहीं है');
    } else if (error.response?.status === 429) {
      toast.error('बहुत अधिक रिक्वेस्ट, कृपया थोड़ी देर में प्रयास करें');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;