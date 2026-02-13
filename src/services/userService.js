import api from '../utils/api';

/**
 * User API Services
 * Handles all user-related API calls
 */

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/user/getuser');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user' };
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/api/user/updateprofile', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Delete user account
export const deleteUserAccount = async () => {
  try {
    const response = await api.delete('/api/user/deleteuser');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete account' };
  }
};

// Follow a user
export const followUser = async (userId) => {
  try {
    const response = await api.put(`/api/user/followuser/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to follow user' };
  }
};

// Unfollow a user
export const unfollowUser = async (userId) => {
  try {
    const response = await api.put(`/api/user/unfollowuser/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to unfollow user' };
  }
};