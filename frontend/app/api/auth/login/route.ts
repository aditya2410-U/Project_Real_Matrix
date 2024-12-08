import axios from 'axios';

// Base URL for your backend API
const API_BASE_URL = 'http://localhost:8083'; // Replace with your actual backend URL

interface LoginResponse {
  token: string;
  user_id: string;
}

interface User {
  id: string;
  email: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (email: string, password: string): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/register`, {
      email,
      password,
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const verifyToken = async (token: string): Promise<User> => {
  try {
    const response = await axios.get<User>(`${API_BASE_URL}/verify-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error('Token verification failed');
  }
};