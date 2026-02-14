import '../styles/PostCard.css';


const PostSkeleton = () => {
  return (
    <div className="post-card skeleton">
      <div className="post-header">
        <div className="post-author">
          <div className="skeleton-avatar"></div>
          <div className="author-info">
            <div className="skeleton-text skeleton-name"></div>
            <div className="skeleton-text skeleton-time"></div>
          </div>
        </div>
      </div>

      <div className="post-image-container">
        <div className="skeleton-image"></div>
      </div>

      <div className="post-actions">
        <div className="skeleton-button"></div>
        <div className="skeleton-button"></div>
      </div>

      <div className="post-description">
        <div className="skeleton-text skeleton-description"></div>
        <div className="skeleton-text skeleton-description-short"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;