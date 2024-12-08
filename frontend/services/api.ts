import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:8083/api/auth';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add interceptor to include token in requests
api.interceptors.request.use(
  config => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Authentication APIs
export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await api.post('/register', { email, password });
  return response.data;
};

export const verifyToken = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: token }
    });
    return response.data;
  } catch (error) {
    throw new Error('Token verification failed');
  }
};