import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser as loginAPI,
  registerUser as registerAPI,
  logoutUser as logoutAPI,
} from "../services/authService.js";
import { getCurrentUser } from "../services/userService";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const response = await getCurrentUser();
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
    // eslint-disable-next-line
  }, []);

  const register = async (userData) => {
    try {
      const response = await registerAPI(userData);

      if (response.success && response.data) {
        const { token, ...userInfo } = response.data;

        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);

        toast.success(response.message || "Registration successful!");
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.message || "Registration failed";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await loginAPI(credentials);

      if (response.success && response.data) {
        const { token, ...userInfo } = response.data;

        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);

        toast.success(response.message || "Login successful!");
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.message || "Login failed";
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    logoutAPI();
    setUser(null);
    toast.info("Logged out successfully");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
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
