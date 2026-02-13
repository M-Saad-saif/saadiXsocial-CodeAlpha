import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiTrendingUp, FiUsers } from 'react-icons/fi';
import '../styles/Sidebar.css';

/**
 * Sidebar Component
 * Side navigation with suggestions and activity
 */
const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      {/* User Profile Card */}
      <div className="sidebar-card profile-card">
        <Link to={`/profile/${user?._id}`} className="profile-link">
          <img
            src={user?.profileImage || 'https://cdn-icons-png.flaticon.com/128/12225/12225935.png'}
            alt={user?.name}
            className="sidebar-avatar"
          />
          <div className="profile-info">
            <h3 className="profile-name">{user?.name}</h3>
            <p className="profile-email">{user?.email}</p>
          </div>
        </Link>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{user?.followers?.length || 0}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{user?.following?.length || 0}</span>
            <span className="stat-label">Following</span>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="sidebar-card">
        <div className="card-header">
          <FiUsers className="card-icon" />
          <h3 className="card-title">Suggestions</h3>
        </div>
        <div className="suggestions-list">
          <div className="suggestion-item">
            <p className="suggestion-text">Follow users to see posts in your feed</p>
          </div>
        </div>
      </div>

      {/* Trending */}
      <div className="sidebar-card">
        <div className="card-header">
          <FiTrendingUp className="card-icon" />
          <h3 className="card-title">Trending</h3>
        </div>
        <div className="trending-list">
          <div className="trending-item">
            <span className="trending-tag">#Photography</span>
          </div>
          <div className="trending-item">
            <span className="trending-tag">#Travel</span>
          </div>
          <div className="trending-item">
            <span className="trending-tag">#Food</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <p>© 2026 SocialConnect</p>
        <div className="footer-links">
          <a href="/" className="footer-link">About</a>
          <a href="/" className="footer-link">Privacy</a>
          <a href="/" className="footer-link">Terms</a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;