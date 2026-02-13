import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiPlusSquare, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import '../styles/Navbar.css';

/**
 * Navbar Component
 * Top navigation bar with user actions
 */
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">◉</span>
          <span className="logo-text">SocialConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <FiHome />
            <span>Home</span>
          </Link>
          <Link to="/create-post" className="nav-link">
            <FiPlusSquare />
            <span>Create</span>
          </Link>
          <Link to={`/profile/${user?._id}`} className="nav-link">
            <FiUser />
            <span>Profile</span>
          </Link>
        </div>

        {/* User Menu */}
        <div className="navbar-user">
          <div className="user-info">
            <img
              src={user?.profileImage || 'https://cdn-icons-png.flaticon.com/128/12225/12225935.png'}
              alt={user?.name}
              className="user-avatar"
            />
            <span className="user-name">{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <FiMenu />
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={toggleMobileMenu}>
            <FiHome />
            <span>Home</span>
          </Link>
          <Link to="/create-post" className="mobile-link" onClick={toggleMobileMenu}>
            <FiPlusSquare />
            <span>Create</span>
          </Link>
          <Link to={`/profile/${user?._id}`} className="mobile-link" onClick={toggleMobileMenu}>
            <FiUser />
            <span>Profile</span>
          </Link>
          <button onClick={handleLogout} className="mobile-link">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;