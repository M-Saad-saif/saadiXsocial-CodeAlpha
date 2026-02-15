import api from '../utils/api';

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/user/getuser');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user' };
  }
};

// Get user profile by ID (for viewing other users' profiles)
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user profile' };
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

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePic', file);

    const response = await api.post('/api/user/uploadprofilepic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to upload profile picture' };
  }
};

// Upload cover image
export const uploadCoverPicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('coverPic', file);

    const response = await api.post('/api/user/uploadcoverpic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to upload cover image' };
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

// Search users by name or email
export const searchUsers = async (query) => {
  try {
    const response = await api.get(`/api/user/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to search users' };
  }
};

// Get suggested users (random users not yet followed)
export const getSuggestedUsers = async () => {
  try {
    const response = await api.get('/api/user/suggestions');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch suggested users' };
  }
};

// Get followers for a given user
export const getFollowers = async (userId) => {
  try {
    const response = await api.get(`/api/user/${userId}/followers`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch followers' };
  }
};

// Get following for a given user
export const getFollowing = async (userId) => {
  try {
    const response = await api.get(`/api/user/${userId}/following`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch following' };
  }
};
