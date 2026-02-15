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

  const hydrateCurrentUser = async (fallbackUser = null) => {
    try {
      const currentUserResponse = await getCurrentUser();
      if (currentUserResponse?.data) {
        setUser(currentUserResponse.data);
        localStorage.setItem("user", JSON.stringify(currentUserResponse.data));
        return currentUserResponse.data;
      }
    } catch (error) {
      if (fallbackUser) {
        setUser(fallbackUser);
        localStorage.setItem("user", JSON.stringify(fallbackUser));
        return fallbackUser;
      }
      throw error;
    }

    return fallbackUser;
  };

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          let parsedStoredUser = null;
          try {
            parsedStoredUser = JSON.parse(storedUser);
          } catch (parseError) {
            parsedStoredUser = null;
          }

          await hydrateCurrentUser(parsedStoredUser);
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

        // Store token first, then hydrate full user payload
        localStorage.setItem("token", token);
        await hydrateCurrentUser(userInfo);

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

        // Store token first, then hydrate full user payload
        localStorage.setItem("token", token);
        await hydrateCurrentUser(userInfo);

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
