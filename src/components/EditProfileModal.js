import { useEffect, useRef, useState } from "react";
import {
  updateUserProfile,
  uploadProfilePicture,
  uploadCoverPicture,
} from "../services/userService";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";
import "../styles/Modal.css";
import { DNA } from "react-loader-spinner";

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const profileFileInputRef = useRef(null);
  const coverFileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    boidata: user?.boidata || "",
    profileImage: user?.profileImage || "",
    coverImage: user?.coverImage || "",
    oldPassword: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(
    user?.profileImage || "",
  );
  const [coverPreview, setCoverPreview] = useState(user?.coverImage || "");

  const mergeUserData = (baseUser, partialUser) => ({
    ...(baseUser || {}),
    ...(partialUser || {}),
    followers: partialUser?.followers ?? baseUser?.followers ?? [],
    following: partialUser?.following ?? baseUser?.following ?? [],
  });

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
        [name]: "",
      }));
    }
  };

  const validateImageFile = (file, inputElement) => {
    if (!file) {
      return false;
    }

    if (!file.type?.startsWith("image/")) {
      toast.error("Please select a valid image file");
      if (inputElement) inputElement.value = "";
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be 5MB or less");
      if (inputElement) inputElement.value = "";
      return false;
    }

    return true;
  };

  const handleProfileFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedProfileFile(null);
      return;
    }

    if (!validateImageFile(file, e.target)) {
      return;
    }

    setSelectedProfileFile(file);
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedCoverFile(null);
      return;
    }

    if (!validateImageFile(file, e.target)) {
      return;
    }

    setSelectedCoverFile(file);
  };

  useEffect(() => {
    if (!selectedProfileFile) {
      setProfilePreview(formData.profileImage || user?.profileImage || "");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedProfileFile);
    setProfilePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedProfileFile, formData.profileImage, user?.profileImage]);

  useEffect(() => {
    if (!selectedCoverFile) {
      setCoverPreview(formData.coverImage || user?.coverImage || "");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedCoverFile);
    setCoverPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedCoverFile, formData.coverImage, user?.coverImage]);

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // If password change is attempted, validate both fields
    if (formData.oldPassword || formData.newPassword) {
      if (!formData.oldPassword) {
        newErrors.oldPassword =
          "Current password is required to change password";
      }
      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = "New password must be at least 6 characters";
      } else if (formData.newPassword === formData.oldPassword) {
        newErrors.newPassword =
          "New password must be different from current password";
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
      let stagedUser = user || {};

      if (selectedProfileFile) {
        const profileUploadResponse =
          await uploadProfilePicture(selectedProfileFile);
        if (!profileUploadResponse?.success || !profileUploadResponse?.user) {
          throw new Error(
            profileUploadResponse?.message || "Profile picture upload failed",
          );
        }

        stagedUser = mergeUserData(stagedUser, profileUploadResponse.user);
      }

      if (selectedCoverFile) {
        const coverUploadResponse = await uploadCoverPicture(selectedCoverFile);
        if (!coverUploadResponse?.success || !coverUploadResponse?.user) {
          throw new Error(
            coverUploadResponse?.message || "Cover image upload failed",
          );
        }

        stagedUser = mergeUserData(stagedUser, coverUploadResponse.user);
      }

      // Only send fields that have values
      const updateData = {
        name: formData.name,
      };

      if (formData.boidata) updateData.boidata = formData.boidata;
      if (stagedUser?.profileImage)
        updateData.profileImage = stagedUser.profileImage;
      if (stagedUser?.coverImage) updateData.coverImage = stagedUser.coverImage;
      if (formData.oldPassword && formData.newPassword) {
        updateData.oldPassword = formData.oldPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await updateUserProfile(updateData);

      if (response.success) {
        const mergedUser = mergeUserData(stagedUser, response.user);
        onUpdate(mergedUser);
        setSelectedProfileFile(null);
        setSelectedCoverFile(null);
        if (profileFileInputRef.current) profileFileInputRef.current.value = "";
        if (coverFileInputRef.current) coverFileInputRef.current.value = "";
        toast.success(response.message || "Profile updated successfully");
        onClose();
      }
    } catch (error) {
      toast.error(error?.message || error?.error || "Failed to update profile");
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
              className={`form-input ${errors.name ? "input-error" : ""}`}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
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
            <label htmlFor="profileImageFile" className="form-label">
              Profile Image
            </label>
            <input
              ref={profileFileInputRef}
              type="file"
              id="profileImageFile"
              accept="image/*"
              onChange={handleProfileFileChange}
              className="form-input"
              disabled={isLoading}
            />
            <div className="profile-upload-row">
              <span className="profile-upload-meta">
                {selectedProfileFile
                  ? selectedProfileFile.name
                  : "No file selected"}
              </span>
            </div>
            {profilePreview && (
              <div className="image-preview-box">
                <img
                  src={profilePreview}
                  alt="Profile preview"
                  className="upload-preview upload-preview-avatar"
                />
              </div>
            )}
            <small className="profile-upload-help">
              JPG, PNG or WEBP up to 5MB. File uploads when you click Save
              Changes.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="coverImageFile" className="form-label">
              Cover Image
            </label>
            <input
              ref={coverFileInputRef}
              type="file"
              id="coverImageFile"
              accept="image/*"
              onChange={handleCoverFileChange}
              className="form-input"
              disabled={isLoading}
            />
            <div className="profile-upload-row">
              <span className="profile-upload-meta">
                {selectedCoverFile
                  ? selectedCoverFile.name
                  : "No file selected"}
              </span>
            </div>
            {coverPreview && (
              <div className="image-preview-box">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="upload-preview upload-preview-cover"
                />
              </div>
            )}
            <small className="profile-upload-help">
              JPG, PNG or WEBP up to 5MB. File uploads when you click Save
              Changes.
            </small>
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
              className={`form-input ${errors.oldPassword ? "input-error" : ""}`}
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
              className={`form-input ${errors.newPassword ? "input-error" : ""}`}
              placeholder="••••••••"
            />
            {errors.newPassword && (
              <span className="error-message">{errors.newPassword}</span>
            )}
          </div>

          {isLoading && (
            <div
              style={{
                textAlign: "center",
              }}
            >
              <DNA
                visible={true}
                height="50"
                width="50"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
              <p>Saving profile</p>
            </div>
          )}

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
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
