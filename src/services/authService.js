import api from "../utils/api";

// Register new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response.data || { message: "Registration failed" };
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/api/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response.data || { message: "Login failed" };
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Validate token by fetching user data
export const validateToken = async () => {
  try {
    const response = await api.get("/api/user/getuser");
    return response.data;
  } catch (error) {
    throw error;
  }
};
