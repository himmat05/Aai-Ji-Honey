import axios from 'axios';

// Automatically detect if running locally in development
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1');

// When developing on localhost, talk to local server on port 5000 where Google OAuth keys & DB are active
const API_BASE_URL = isLocalhost
  ? (import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:5000')
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000');

console.log('📡 API Base URL configured to:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach auth bearer token automatically
apiClient.interceptors.request.use(
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

export default apiClient;
