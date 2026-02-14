import { useEffect } from "react";
import { useFeed } from "../context/FeedContext";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton";
import SearchUsers from "../components/SearchUsers";
import { useInView } from "react-intersection-observer";
import "../styles/Home.css";

const Home = () => {
  const { posts, loading, hasMore, fetchFeed, refreshFeed } = useFeed();
  const { user } = useAuth();
  const { ref, inView } = useInView();

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

  const handleRefresh = () => {
    refreshFeed();
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

      {/* Search Users Section */}
      <div className="search-section">
        <SearchUsers />
      </div>

      <div className="feed-container">
        {loading && posts.length === 0 ? (
          // Initial loading state
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.length === 0 ? (
          // Empty state
          <div className="empty-feed">
            <div className="empty-icon">📭</div>
            <h2>No posts yet</h2>
            <p>Follow users to see their posts in your feed</p>
          </div>
        ) : (
          // Posts
          <>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} currentUser={user} />
            ))}

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div ref={ref} className="load-more-trigger">
                {loading && <PostSkeleton />}
              </div>
            )}

            {/* End of feed message */}
            {!hasMore && posts.length > 0 && (
              <div className="end-of-feed">
                <p>You're all caught up! 🎉</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
