import { createContext, useContext, useState, useCallback } from 'react';
import { getFeed, likePost as likePostAPI, deletePost as deletePostAPI } from '../services/postService';
import { toast } from 'react-toastify';

const FeedContext = createContext(null);

/**
 * Custom hook to use Feed context
 */
export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error('useFeed must be used within FeedProvider');
  }
  return context;
};

/**
 * Feed Provider Component
 * Manages feed state globally
 */
export const FeedProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /**
   * Fetch feed posts
   */
  const fetchFeed = useCallback(async (refresh = false) => {
    try {
      setLoading(true);
      const response = await getFeed();
      
      if (Array.isArray(response)) {
        if (refresh) {
          setPosts(response);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...response]);
        }
        
        // If no posts returned, we've reached the end
        if (response.length === 0) {
          setHasMore(false);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh feed (load from beginning)
   */
  const refreshFeed = useCallback(async () => {
    setHasMore(true);
    await fetchFeed(true);
  }, [fetchFeed]);

  /**
   * Like a post
   */
  const likePost = useCallback(async (postId, userId) => {
    try {
      await likePostAPI(postId);
      
      // Optimistically update the UI
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id === postId) {
            const isLiked = post.likes?.includes(userId);
            return {
              ...post,
              likes: isLiked
                ? post.likes.filter((id) => id !== userId)
                : [...(post.likes || []), userId],
            };
          }
          return post;
        })
      );
      
      toast.success('Post liked!');
    } catch (error) {
      toast.error(error.message || 'Failed to like post');
    }
  }, []);

  /**
   * Delete a post
   */
  const deletePost = useCallback(async (postId) => {
    try {
      await deletePostAPI(postId);
      
      // Remove post from state
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete post');
    }
  }, []);

  /**
   * Add a new post to the feed
   */
  const addPost = useCallback((newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  }, []);

  const value = {
    posts,
    loading,
    hasMore,
    fetchFeed,
    refreshFeed,
    likePost,
    deletePost,
    addPost,
  };

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
};