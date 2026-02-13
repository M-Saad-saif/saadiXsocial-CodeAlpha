import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as loginAPI, registerUser as registerAPI, logoutUser as logoutAPI }
 from '../services/authService.js';
import { getCurrentUser } from '../services/userService';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

/**
 * Custom hook to use Auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * Auth Provider Component
 * Manages authentication state globally
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Validate token by fetching current user
          const response = await getCurrentUser();
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Register new user
   */
  const register = async (userData) => {
    try {
      const response = await registerAPI(userData);
      
      if (response.success && response.data) {
        const { token, ...userInfo } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
        
        toast.success(response.message || 'Registration successful!');
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Login user
   */
  const login = async (credentials) => {
    try {
      const response = await loginAPI(credentials);
      
      if (response.success && response.data) {
        const { token, ...userInfo } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
        
        toast.success(response.message || 'Login successful!');
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    logoutAPI();
    setUser(null);
    toast.info('Logged out successfully');
  };

  /**
   * Update user data in context
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};