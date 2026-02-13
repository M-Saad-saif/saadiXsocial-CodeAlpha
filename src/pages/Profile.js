import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser, followUser, unfollowUser } from '../services/userService';
import { toast } from 'react-toastify';
import EditProfileModal from '../components/EditProfileModal';
import '../styles/Profile.css';

/**
 * Profile Page Component
 * Displays user profile with posts and follow functionality
 */
const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isOwnProfile = !userId || userId === currentUser?.id || userId === currentUser?._id;

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
        } else {
          // In a real app, you'd have an endpoint to fetch other users' profiles
          // For now, we'll show current user profile
          const response = await getCurrentUser();
          setProfileUser(response.data);
        }
        
        // Check if current user is following this profile
        if (!isOwnProfile && currentUser?.following) {
          setIsFollowing(currentUser.following.includes(userId));
        }
      } catch (error) {
        toast.error('Failed to load profile');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, isOwnProfile, currentUser]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
        toast.success('Unfollowed user');
      } else {
        await followUser(userId);
        setIsFollowing(true);
        toast.success('Following user');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update follow status');
    }
  };

  // Handle profile update
  const handleProfileUpdate = (updatedUser) => {
    setProfileUser(updatedUser);
    updateUser(updatedUser);
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
        <button onClick={() => navigate('/')} className="back-button">
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
          src={profileUser.coverImage || 'https://cdn-icons-png.flaticon.com/128/4131/4131708.png'}
          alt="Cover"
          className="cover-image"
        />
      </div>

      {/* Profile Info */}
      <div className="profile-info">
        <div className="profile-avatar-container">
          <img
            src={profileUser.profileImage || 'https://cdn-icons-png.flaticon.com/128/12225/12225935.png'}
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
                <button
                  onClick={() => setShowEditModal(true)}
                  className="edit-profile-button"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className={`follow-button ${isFollowing ? 'following' : ''}`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>

          {profileUser.boidata && (
            <p className="profile-bio">{profileUser.boidata}</p>
          )}

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{profileUser.followers?.length || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profileUser.following?.length || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts Section */}
      <div className="profile-posts">
        <h2 className="section-title">Posts</h2>
        <div className="posts-grid">
          {/* In a real app, you'd fetch and display user's posts here */}
          <div className="empty-posts">
            <p>No posts yet</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={profileUser}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile;