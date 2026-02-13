import { useState } from 'react';
import { updateUserProfile } from '../services/userService';
import { toast } from 'react-toastify';
import { FiX } from 'react-icons/fi';
import '../styles/Modal.css';

/**
 * Edit Profile Modal Component
 * Modal for editing user profile information
 */
const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    boidata: user.boidata || '',
    profileImage: user.profileImage || '',
    coverImage: user.coverImage || '',
    oldPassword: '',
    newPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // If password change is attempted, validate both fields
    if (formData.oldPassword || formData.newPassword) {
      if (!formData.oldPassword) {
        newErrors.oldPassword = 'Current password is required';
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      // Only send fields that have values
      const updateData = {
        name: formData.name,
      };

      if (formData.boidata) updateData.boidata = formData.boidata;
      if (formData.profileImage) updateData.profileImage = formData.profileImage;
      if (formData.coverImage) updateData.coverImage = formData.coverImage;
      if (formData.oldPassword && formData.newPassword) {
        updateData.oldPassword = formData.oldPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await updateUserProfile(updateData);
      
      if (response.success) {
        onUpdate(response.user);
        toast.success(response.message || 'Profile updated successfully');
        onClose();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Profile</h2>
          <button onClick={onClose} className="modal-close">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'input-error' : ''}`}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="boidata" className="form-label">
              Bio
            </label>
            <textarea
              id="boidata"
              name="boidata"
              value={formData.boidata}
              onChange={handleChange}
              className="form-textarea"
              rows="3"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="profileImage" className="form-label">
              Profile Image URL
            </label>
            <input
              type="text"
              id="profileImage"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/profile.jpg"
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverImage" className="form-label">
              Cover Image URL
            </label>
            <input
              type="text"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="form-input"
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div className="form-divider">
            <span>Change Password (Optional)</span>
          </div>

          <div className="form-group">
            <label htmlFor="oldPassword" className="form-label">
              Current Password
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className={`form-input ${errors.oldPassword ? 'input-error' : ''}`}
              placeholder="••••••••"
            />
            {errors.oldPassword && (
              <span className="error-message">{errors.oldPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`form-input ${errors.newPassword ? 'input-error' : ''}`}
              placeholder="••••••••"
            />
            {errors.newPassword && (
              <span className="error-message">{errors.newPassword}</span>
            )}
          </div>

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
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;