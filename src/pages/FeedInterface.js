import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFeed } from "../context/FeedContext";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton";
import SearchUsers from "../components/SearchUsers";
import {
  getSuggestedUsers,
  followUser,
  unfollowUser,
} from "../services/userService";
import { toast } from "react-toastify";
import { useInView } from "react-intersection-observer";
import "../styles/FeedInterface.css";

const FeedInterface = () => {
  const { posts, loading, hasMore, fetchFeed, refreshFeed } = useFeed();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const uniquePosts = useMemo(() => {
    const seen = new Set();
    return posts.filter((post) => {
      if (!post?._id || seen.has(post._id)) return false;
      seen.add(post._id);
      return true;
    });
  }, [posts]);

  useEffect(() => {
    fetchFeed(true);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchFeed();
    }
    // eslint-disable-next-line
  }, [inView, hasMore, loading]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await getSuggestedUsers();
        setSuggestedUsers(response?.data || []);
      } catch (error) {
        setSuggestedUsers([]);
      }
    };

    fetchSuggestions();
  }, []);

  const handleRefresh = () => {
    refreshFeed();
  };

  const isFollowing = (userId) => {
    return user?.following?.includes(userId) || false;
  };

  const handleSuggestionFollowToggle = async (suggestedUserId) => {
    const currentlyFollowing = isFollowing(suggestedUserId);

    try {
      if (currentlyFollowing) {
        await unfollowUser(suggestedUserId);
        const updatedFollowing = (user?.following || []).filter(
          (id) => id !== suggestedUserId,
        );
        updateUser({ ...user, following: updatedFollowing });
        toast.success("Unfollowed user");
      } else {
        await followUser(suggestedUserId);
        const updatedFollowing = [...(user?.following || []), suggestedUserId];
        updateUser({ ...user, following: updatedFollowing });
        toast.success("Following user");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update follow status");
    }
  };

  const renderSuggestionContainer = (key = "suggestion-container") => {
    if (suggestedUsers.length === 0) return null;

    return (
      <div key={key} className="inline-suggestion-card">
        <p className="inline-suggestion-label">Suggested for you</p>
        <div className="inline-suggestion-list">
          {suggestedUsers.map((suggestedUser) => {
            const userIsFollowing = isFollowing(suggestedUser._id);

            return (
              <div key={suggestedUser._id} className="inline-suggestion-content">
                <img
                  src={
                    suggestedUser.profileImage ||
                    "https://cdn-icons-png.flaticon.com/128/12225/12225935.png"
                  }
                  alt={suggestedUser.name}
                  className="inline-suggestion-avatar"
                  onClick={() => navigate(`/profile/${suggestedUser._id}`)}
                />
                <div
                  className="inline-suggestion-info"
                  onClick={() => navigate(`/profile/${suggestedUser._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      navigate(`/profile/${suggestedUser._id}`);
                    }
                  }}
                >
                  <h4>{suggestedUser.name}</h4>
                  <p>{suggestedUser.email}</p>
                </div>
                <button
                  onClick={() => handleSuggestionFollowToggle(suggestedUser._id)}
                  className={`inline-suggestion-follow ${
                    userIsFollowing ? "following" : ""
                  }`}
                >
                  {userIsFollowing ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPostsWithSuggestions = () => {
    return uniquePosts.flatMap((post, index) => {
      const postNode = <PostCard key={post._id} post={post} currentUser={user} />;

      if (index === 1) {
        const suggestionBlock = renderSuggestionContainer("after-two-posts");
        return suggestionBlock ? [postNode, suggestionBlock] : [postNode];
      }

      return [postNode];
    });
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Your Feed</h1>
        <button
          onClick={handleRefresh}
          className="refresh-button"
          disabled={loading}
        >
          <svg
            className={`refresh-icon ${loading ? "spinning" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      <div className="search-section">
        <SearchUsers />
      </div>

      <div className="feed-container">
        {loading && uniquePosts.length === 0 ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : uniquePosts.length === 0 ? (
          <>
            <div className="empty-feed">
              <div className="empty-icon">No posts</div>
              <h2>No posts yet</h2>
              <p>Follow users to see their posts in your feed</p>
            </div>
            {renderSuggestionContainer("empty-feed-suggestions")}
          </>
        ) : (
          <>
            {renderPostsWithSuggestions()}

            {hasMore && (
              <div ref={ref} className="load-more-trigger">
                {loading && <PostSkeleton />}
              </div>
            )}

            {!hasMore && uniquePosts.length > 0 && (
              <div className="end-of-feed">
                <p>You're all caught up!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeedInterface;
