import api from '../utils/api';

/**
 * Post API Services
 * Handles all post-related API calls
 */

// Create a new post
export const createPost = async (postData) => {
  try {
    const response = await api.post('/api/post/createpost', postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create post' };
  }
};

// Get a single post by ID
export const getPost = async (postId) => {
  try {
    const response = await api.get(`/api/post/getpost/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch post' };
  }
};

// Get feed (posts from followed users)
export const getFeed = async () => {
  try {
    const response = await api.get('/api/post/feed');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch feed' };
  }
};

// Like a post
export const likePost = async (postId) => {
  try {
    const response = await api.put(`/api/post/likepost/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to like post' };
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/api/post/deletepost/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete post' };
  }
};