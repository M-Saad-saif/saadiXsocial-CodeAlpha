import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getSuggestedUsers,
  followUser,
  unfollowUser,
} from "../services/userService";
import { FiTrendingUp, FiUsers, FiUserPlus, FiUserCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch suggested users on component mount
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        setLoading(true);
        const response = await getSuggestedUsers();
        setSuggestedUsers(response.data || []);
      } catch (error) {
        console.error("Failed to fetch suggested users:", error);
        setSuggestedUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, []);

  // Navigate to user profile
  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  // Handle follow/unfollow action
  const handleFollowToggle = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        toast.success("Unfollowed user");

        // Update user's following list
        const updatedFollowing = user.following.filter((id) => id !== userId);
        updateUser({ ...user, following: updatedFollowing });
      } else {
        await followUser(userId);
        toast.success("Following user");

        // Update user's following list
        const updatedFollowing = [...(user.following || []), userId];
        updateUser({ ...user, following: updatedFollowing });
      }

      // Update suggested users list
      setSuggestedUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isFollowing: !isFollowing } : u,
        ),
      );
    } catch (error) {
      toast.error(error.message || "Failed to update follow status");
    }
  };

  // Check if user is being followed

  const isFollowing = (userId) => {
    return user?.following?.includes(userId) || false;
  };

  return (
    <aside className="sidebar">
      {/* User Profile Card */}
      <div className="sidebar-card profile-card">
        <Link to={`/profile/${user?._id}`} className="profile-link">
          <img
            src={
              user?.profileImage ||
              "https://cdn-icons-png.flaticon.com/128/12225/12225935.png"
            }
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
          {loading ? (
            <div className="suggestions-loading">
              <div className="loading-spinner-small"></div>
              <p>Loading...</p>
            </div>
          ) : suggestedUsers.length > 0 ? (
            suggestedUsers.map((suggestedUser) => {
              const userIsFollowing = isFollowing(suggestedUser._id);
              return (
                <div key={suggestedUser._id} className="suggestion-item">
                  <img
                    src={
                      suggestedUser.profileImage ||
                      "https://cdn-icons-png.flaticon.com/128/12225/12225935.png"
                    }
                    alt={suggestedUser.name}
                    className="suggestion-avatar"
                    onClick={() => handleViewProfile(suggestedUser._id)}
                    style={{ cursor: "pointer" }}
                  />
                  <div className="suggestion-info">
                    <h4
                      className="suggestion-name"
                      onClick={() => handleViewProfile(suggestedUser._id)}
                      style={{ cursor: "pointer" }}
                    >
                      {suggestedUser.name}
                    </h4>
                    <p className="suggestion-email">{suggestedUser.email}</p>
                  </div>
                  <button
                    onClick={() =>
                      handleFollowToggle(suggestedUser._id, userIsFollowing)
                    }
                    className={`suggestion-follow-button ${
                      userIsFollowing ? "following" : ""
                    }`}
                    title={userIsFollowing ? "Unfollow" : "Follow"}
                  >
                    {userIsFollowing ? <FiUserCheck /> : <FiUserPlus />}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="suggestion-item">
              <p className="suggestion-text">No more users to follow</p>
            </div>
          )}
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
        <p>© 2026 saadIXsocials</p>
        <div className="footer-links">
          <a href="https://github.com/M-Saad-saif" className="footer-link">
            Github
          </a>
          <a
            href="https://www.linkedin.com/in/muhammad-saad-saif-10b38a360/"
            className="footer-link"
          >
            Linkedin
          </a>
          <a href="mailto:gcsaadsaif123@gmail.com" className="footer-link">
            Email
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
