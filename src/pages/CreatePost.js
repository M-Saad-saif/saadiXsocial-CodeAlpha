import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/postService";
import { useFeed } from "../context/FeedContext";
import { toast } from "react-toastify";
import "../styles/CreatePost.css";

const CreatePost = () => {
  const navigate = useNavigate();
  const { addPost } = useFeed();

  const [formData, setFormData] = useState({
    description: "",
    postImage: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle text input changes
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

  // Handle image URL input
  const handleImageChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({
      ...prev,
      postImage: url,
    }));
    setImagePreview(url);

    if (errors.postImage) {
      setErrors((prev) => ({
        ...prev,
        postImage: "",
      }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.postImage.trim()) {
      newErrors.postImage = "Image URL is required";
    } else {
      // Basic URL validation
      try {
        new URL(formData.postImage);
      } catch {
        newErrors.postImage = "Please enter a valid image URL";
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
      const response = await createPost(formData);

      if (response.success) {
        // Add post to feed
        addPost(response.post);

        toast.success(response.message || "Post created successfully!");
        navigate("/feedinterface");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/feedinterface");
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <div className="create-post-header">
          <h1 className="create-post-title">Create New Post</h1>
          <p className="create-post-subtitle">
            Share your moment with the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          {/* Image URL Input */}
          <div className="form-group">
            <label htmlFor="postImage" className="form-label">
              Image URL
            </label>
            <input
              type="text"
              id="postImage"
              name="postImage"
              value={formData.postImage}
              onChange={handleImageChange}
              className={`form-input ${errors.postImage ? "input-error" : ""}`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.postImage && (
              <span className="error-message">{errors.postImage}</span>
            )}
            <p className="input-hint">
              Paste a direct link to your image (jpg, png, gif, etc.)
            </p>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="image-preview">
              <img
                src={imagePreview}
                alt="Preview"
                onError={() => {
                  setImagePreview("");
                  setErrors((prev) => ({
                    ...prev,
                    postImage: "Failed to load image. Please check the URL.",
                  }));
                }}
              />
            </div>
          )}

          {/* Description Input */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Share your thoughts..."
              rows="4"
              maxLength="500"
            />
            <div className="character-count">
              {formData.description.length}/500
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
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
              {isLoading ? (
                <span className="button-loading">
                  <span className="spinner"></span>
                  Posting...
                </span>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
