import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getCurrentUser,
  getUserById,
  followUser,
  unfollowUser,
} from "../services/userService";
import { getUserPosts } from "../services/postService";
import { toast } from "react-toastify";
import AccountSettings from "../components/AccountSettings";
import PostCard from "../components/PostCard";
import FollowersModal from "../components/FollowersModal";
import "../styles/Profile.css";

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const isOwnProfile =
    !userId ||
    userId === currentUser.id ||
    userId === currentUser._id ||
    String(userId) === String(currentUser._id);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        if (isOwnProfile) {
          // Fetch current user's profile
          const response = await getCurrentUser();
          setProfileUser(response.data);
          updateUser(response.data);
        } else if (userId) {
          // Fetch other user's profile by ID
          const response = await getUserById(userId);
          setProfileUser(response.data);

          // Check if current user is following this profile
          if (currentUser?.following) {
            setIsFollowing(currentUser.following.includes(userId));
          }
        }
      } catch (error) {
        toast.error("Failed to load profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line
  }, [userId, isOwnProfile]); // Removed currentUser from dependencies to prevent unnecessary re-renders

  /**
   * Fetch user posts - runs whenever userId or isOwnProfile changes
   */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setPostsLoading(true);

        // Determine which user ID to use for fetching posts
        const targetUserId = isOwnProfile
          ? currentUser?._id || currentUser?.id
          : userId;

        if (targetUserId) {
          const response = await getUserPosts(targetUserId);
          setUserPosts(response.data || []);
        }
      } catch (error) {
        console.error("Failed to load user posts:", error);
        // Don't show error toast for posts, allow graceful empty state
        setUserPosts([]);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, [userId, isOwnProfile, currentUser]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
        toast.success("Unfollowed user");
      } else {
        await followUser(userId);
        setIsFollowing(true);
        toast.success("Following user");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update follow status");
    }
  };

  // Handle profile update
  const handleProfileUpdate = (updatedUser) => {
    setProfileUser(updatedUser);
    updateUser(updatedUser);
  };

  // Handle post deletion (remove from posts list)
  const handlePostDeleted = (deletedPostId) => {
    setUserPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== deletedPostId),
    );
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="profile-error">
        <h2>Profile not found</h2>
        <button onClick={() => navigate("/")} className="back-button">
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Cover Image */}
      <div className="profile-cover">
        <img
          src={
            profileUser.coverImage ||
            "https://cdn-icons-png.flaticon.com/128/4131/4131708.png"
          }
          alt="Cover"
          className="cover-image"
        />
      </div>

      {/* Profile Info */}
      <div className="profile-info">
        <div className="profile-avatar-container">
          <img
            src={
              profileUser.profileImage ||
              "https://cdn-icons-png.flaticon.com/128/12225/12225935.png"
            }
            alt={profileUser.name}
            className="profile-avatar"
          />
        </div>

        <div className="profile-details">
          <div className="profile-header">
            <div>
              <h1 className="profile-name">{profileUser.name}</h1>
              <p className="profile-email">{profileUser.email}</p>
            </div>

            <div className="profile-actions">
              {isOwnProfile ? (
                <AccountSettings
                  user={profileUser}
                  onProfileUpdate={handleProfileUpdate}
                />
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className={`follow-button ${isFollowing ? "following" : ""}`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          {profileUser.boidata && (
            <p className="profile-bio"><span style={{color:"white", fontWeight:"bold"}}>Bio: </span>  {profileUser.boidata}</p>
          )}

          <div className="profile-stats">
            <div
              className="stat clickable"
              onClick={() => setFollowersOpen(true)}
              role="button"
              tabIndex={0}
            >
              <span className="stat-value">
                {profileUser.followers?.length || 0}
              </span>
              <span className="stat-label">Followers</span>
            </div>
            <div
              className="stat clickable"
              onClick={() => setFollowingOpen(true)}
              role="button"
              tabIndex={0}
            >
              <span className="stat-value">
                {profileUser.following?.length || 0}
              </span>
              <span className="stat-label">Following</span>
            </div>
            <div className="stat">
              <span className="stat-value">{userPosts.length || 0}</span>
              <span className="stat-label">Posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts Section */}
      <div className="profile-posts">
        <h2 className="section-title">Posts</h2>

        {postsLoading ? (
          <div className="posts-loading">
            <div className="loading-spinner"></div>
          </div>
        ) : userPosts.length > 0 ? (
          <div className="posts-grid">
            {userPosts.map((post) => (
              <div key={post._id} className="post-grid-item">
                <PostCard
                  post={post}
                  currentUser={currentUser}
                  onPostDeleted={handlePostDeleted}
                  showProfileDeleteButton={isOwnProfile}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-posts">
            <p>No posts yet</p>
          </div>
        )}
      </div>

      {/* Followers / Following Modals */}
      <FollowersModal
        open={followersOpen}
        onClose={() => setFollowersOpen(false)}
        userId={profileUser._id || profileUser.id}
        type="followers"
      />
      <FollowersModal
        open={followingOpen}
        onClose={() => setFollowingOpen(false)}
        userId={profileUser._id || profileUser.id}
        type="following"
      />
    </div>
  );
};

export default Profile;
