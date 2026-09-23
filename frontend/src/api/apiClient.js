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

// Response interceptor: automatically catch 401/403 token expirations and cleanly handle session
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const currentToken = localStorage.getItem('token');
      const errMessage = String(error.response.data?.message || error.response.data?.error || '').toLowerCase();
      if (currentToken && (errMessage.includes('token') || errMessage.includes('expired') || errMessage.includes('invalid') || error.response.status === 401)) {
        console.warn('🔒 Session authentication expired or revoked. Resetting stored credentials...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('last_activity_time');
        if (
          window.location.pathname.includes('order') ||
          window.location.pathname.includes('admin') ||
          window.location.pathname.includes('add-product')
        ) {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
