import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FiHeart, FiMessageCircle, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { useFeed } from '../context/FeedContext';
import '../styles/PostCard.css';

/**
 * PostCard Component
 * Displays individual post with interactions
 */
const PostCard = ({ post, currentUser, onPostDeleted }) => {
  const { likePost, deletePost } = useFeed();
  const [showMenu, setShowMenu] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isOwner = post.user?._id === currentUser?.id || post.user?._id === currentUser?._id;
  const isLiked = post.likes?.includes(currentUser?.id) || post.likes?.includes(currentUser?._id);
  const likesCount = post.likes?.length || 0;

  // Format post date
  const formattedDate = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : 'Just now';

  // Handle like toggle
  const handleLike = () => {
    likePost(post._id, currentUser?._id || currentUser?.id);
  };

  // Handle delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(post._id);
      // Notify parent component about deletion
      if (onPostDeleted) {
        onPostDeleted(post._id);
      }
    }
  };

  return (
    <article className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <Link to={`/profile/${post.user?._id}`} className="post-author">
          <img
            src={post.user?.profileImage || 'https://cdn-icons-png.flaticon.com/128/12225/12225935.png'}
            alt={post.user?.name}
            className="author-avatar"
          />
          <div className="author-info">
            <h3 className="author-name">{post.user?.name || 'Unknown User'}</h3>
            <span className="post-time">{formattedDate}</span>
          </div>
        </Link>

        {isOwner && (
          <div className="post-menu">
            <button
              className="menu-button"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FiMoreVertical />
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <button onClick={handleDelete} className="menu-item delete">
                  <FiTrash2 />
                  <span>Delete Post</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Image */}
      <div className="post-image-container">
        {!imageLoaded && (
          <div className="image-skeleton">
            <div className="skeleton-animation"></div>
          </div>
        )}
        <img
          src={post.postImage}
          alt="Post"
          className={`post-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
            setImageLoaded(true);
          }}
        />
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <button
          onClick={handleLike}
          className={`action-button ${isLiked ? 'liked' : ''}`}
        >
          <FiHeart className={isLiked ? 'filled' : ''} />
          <span>{likesCount}</span>
        </button>
        <button className="action-button">
          <FiMessageCircle />
          <span>0</span>
        </button>
      </div>

      {/* Post Description */}
      {post.description && (
        <div className="post-description">
          <Link to={`/profile/${post.user?._id}`} className="description-author">
            {post.user?.name}
          </Link>
          <span className="description-text">{post.description}</span>
        </div>
      )}
    </article>
  );
};

export default PostCard;