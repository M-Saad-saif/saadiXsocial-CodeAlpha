import api from '../utils/api';

// Create a new post
export const createPost = async (postData) => {
  try {
    const response = await api.post('/api/post/createpost', postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create post' };
  }
};

// Upload post image
export const uploadPostImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("postImage", file);

    const response = await api.post("/api/post/uploadpostimage", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to upload post image" };
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

// Get all posts by a specific user
export const getUserPosts = async (userId) => {
  try {
    const response = await api.get(`/api/post/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user posts' };
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
