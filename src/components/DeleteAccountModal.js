import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUserAccount } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import "../styles/Modal.css";

/**
 * Delete Account Modal Component
 * Confirmation modal for account deletion with warning
 */
const DeleteAccountModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const CONFIRM_TEXT = "DELETE";

  // Handle account deletion
  const handleDelete = async (e) => {
    e.preventDefault();

    if (confirmText !== CONFIRM_TEXT) {
      setError(`Please type "${CONFIRM_TEXT}" to confirm`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await deleteUserAccount();

      if (response.success) {
        toast.success("Account deleted successfully");
        logout();
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete account");
      setError(error.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Delete Account</h2>
          <button onClick={onClose} className="modal-close">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleDelete} className="modal-form">
          {/* Warning Section */}
          <div className="delete-warning">
            <FiAlertTriangle className="warning-icon" />
            <h3>Are you absolutely sure?</h3>
            <p>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </p>
          </div>

          {/* What will be deleted */}
          <div className="delete-consequences">
            <h4>What will be deleted:</h4>
            <ul>
              <li>Your profile information</li>
              <li>All your posts and images</li>
              <li>Your followers and following connections</li>
              <li>All likes and interactions</li>
              <li>Your account data (permanently)</li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div className="form-group">
            <label htmlFor="confirmText" className="form-label">
              Type <strong>{CONFIRM_TEXT}</strong> to confirm deletion
            </label>
            <input
              type="text"
              id="confirmText"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError("");
              }}
              className={`form-input ${error ? "input-error" : ""}`}
              placeholder={`Type ${CONFIRM_TEXT} here`}
              autoComplete="off"
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          {/* Action Buttons */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="delete-button"
              disabled={isLoading || confirmText !== CONFIRM_TEXT}
            >
              {isLoading ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
