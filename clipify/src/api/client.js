import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject Authorization header from token
let getToken = () => null;

export const setTokenGetter = (fn) => {
  getToken = fn;
};

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Don't override Content-Type for FormData – let the browser set multipart/form-data with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Trigger auth clear - handled by AuthContext
      window.dispatchEvent(new CustomEvent('auth:401'));
    }
    return Promise.reject(error);
  }
);

export const getApiBaseURL = () => baseURL;

export default apiClient;
