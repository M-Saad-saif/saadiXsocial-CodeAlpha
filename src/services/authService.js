import api from '../utils/api';

/**
 * Authentication API Services
 * Handles all authentication-related API calls
 */

// Register new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Logout user (client-side only)
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Validate token by fetching user data
export const validateToken = async () => {
  try {
    const response = await api.get('/api/user/getuser');
    return response.data;
  } catch (error) {
    throw error;
  }
};