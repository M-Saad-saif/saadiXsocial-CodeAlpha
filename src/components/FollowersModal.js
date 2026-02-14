import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFollowers, getFollowing } from "../services/userService";
import { FiX } from "react-icons/fi";
import "../styles/Modal.css";
import "../styles/FollowersModal.css";

/**
 * FollowersModal
 * Reusable modal to show followers or following list for a profile
 */
const FollowersModal = ({ open, onClose, userId, type = "followers" }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const fetch = async () => {
      try {
        setLoading(true);
        setError("");
        const resp =
          type === "following"
            ? await getFollowing(userId)
            : await getFollowers(userId);

        // Support different response shapes: either the service returns
        // the backend wrapper ({ success, count, data }) or directly the array.
        const itemsList = Array.isArray(resp)
          ? resp
          : resp?.data ?? resp ?? [];

        setItems(itemsList || []);
      } catch (err) {
        console.error("Failed to load list:", err);
        setError(err.message || "Failed to load list");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [open, userId, type]);

  if (!open) return null;

  const handleUserClick = (id) => {
    onClose();
    navigate(`/profile/${id}`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {type === "following" ? "Following" : "Followers"}
          </h2>
          <button onClick={onClose} className="modal-close">
            <FiX />
          </button>
        </div>

        <div className="modal-form">
          {loading ? (
            <div style={{ textAlign: "center" }}>
              <div className="loading-spinner-small" style={{ margin: 16 }} />
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: "center" }}>No users found</div>
          ) : (
            <div className="followers-list">
              {items.map((u) => (
                <div key={u._id} className="f-item">
                  <img
                    src={
                      u.profileImage ||
                      "https://cdn-icons-png.flaticon.com/128/12225/12225935.png"
                    }
                    alt={u.name}
                    className="f-avatar"
                    onClick={() => handleUserClick(u._id)}
                    style={{ cursor: "pointer" }}
                  />
                  <div className="f-info">
                    <button
                      className="f-username"
                      onClick={() => handleUserClick(u._id)}
                    >
                      {u.email || u.name}
                    </button>
                    <div className="f-name">{u.name || ""}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
