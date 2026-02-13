import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { searchUsers } from "../services/userService";
import { followUser, unfollowUser } from "../services/userService";
import { toast } from "react-toastify";
import { FiSearch, FiX, FiUserPlus, FiUserCheck } from "react-icons/fi";
import "../styles/SearchUsers.css";

/**
 * SearchUsers Component
 * Allows users to search for other users and follow/unfollow them
 */
const SearchUsers = () => {
  const { user, updateUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search users with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Perform search
  const handleSearch = async () => {
    try {
      setLoading(true);
      const results = await searchUsers(searchQuery);

      // Filter out current user from results
      const filteredResults = results.filter(
        (u) => u._id !== user._id && u._id !== user.id,
      );

      setSearchResults(filteredResults);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle follow/unfollow
  const handleFollowToggle = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        toast.success("Unfollowed user");

        // Update user's following list
        const updatedFollowing = user.following.filter((id) => id !== userId);
        updateUser({ ...user, following: updatedFollowing });

        // Update search results
        setSearchResults((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isFollowing: false } : u,
          ),
        );
      } else {
        await followUser(userId);
        toast.success("Following user");

        // Update user's following list
        const updatedFollowing = [...(user.following || []), userId];
        updateUser({ ...user, following: updatedFollowing });

        // Update search results
        setSearchResults((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isFollowing: true } : u)),
        );
      }
    } catch (error) {
      toast.error(error.message || "Failed to update follow status");
    }
  };

  // Clear search
  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  // Check if user is following
  const isFollowing = (userId) => {
    return user?.following?.includes(userId) || false;
  };

  return (
    <div className="search-users-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
        />
        {searchQuery && (
          <button className="clear-button" onClick={handleClear}>
            <FiX />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="search-results-dropdown">
          {loading ? (
            <div className="search-loading">
              <div className="loading-spinner-small"></div>
              <span>Searching...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="search-results-list">
              {searchResults.map((searchUser) => {
                const isUserFollowing = isFollowing(searchUser._id);

                return (
                  <div key={searchUser._id} className="search-result-item">
                    <div className="search-user-info">
                      <img
                        src={
                          searchUser.profileImage ||
                          "https://cdn-icons-png.flaticon.com/128/12225/12225935.png"
                        }
                        alt={searchUser.name}
                        className="search-user-avatar"
                      />
                      <div className="search-user-details">
                        <h4 className="search-user-name">{searchUser.name}</h4>
                        <p className="search-user-email">{searchUser.email}</p>
                        {searchUser.boidata && (
                          <p className="search-user-bio">
                            {searchUser.boidata}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleFollowToggle(searchUser._id, isUserFollowing)
                      }
                      className={`follow-toggle-button ${
                        isUserFollowing ? "following" : ""
                      }`}
                    >
                      {isUserFollowing ? (
                        <>
                          <FiUserCheck />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <FiUserPlus />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="search-no-results">
              <p>No users found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUsers;
