import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, uploadPostImage } from "../services/postService";
import { useFeed } from "../context/FeedContext";
import { toast } from "react-toastify";
import "../styles/CreatePost.css";
import { DNA } from "react-loader-spinner";

const CreatePost = () => {
  const navigate = useNavigate();
  const { addPost } = useFeed();

  const [formData, setFormData] = useState({
    description: "",
  });

  const [selectedImageFile, setSelectedImageFile] = useState(null);
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

  // Handle image file input
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedImageFile(null);
      return;
    }

    if (!file.type?.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        postImage: "Please select a valid image file",
      }));
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        postImage: "Image size must be 5MB or less",
      }));
      e.target.value = "";
      return;
    }

    setSelectedImageFile(file);

    if (errors.postImage) {
      setErrors((prev) => ({
        ...prev,
        postImage: "",
      }));
    }
  };

  useEffect(() => {
    if (!selectedImageFile) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedImageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedImageFile]);

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!selectedImageFile) {
      newErrors.postImage = "Image file is required";
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
      const uploadResponse = await uploadPostImage(selectedImageFile);
      if (!uploadResponse?.success || !uploadResponse?.imageUrl) {
        throw new Error(
          uploadResponse?.message || "Failed to upload post image",
        );
      }

      const postPayload = {
        description: formData.description,
        postImage: uploadResponse.imageUrl,
      };

      const response = await createPost(postPayload);

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
          {/* Image Input */}
          <div className="form-group">
            <label htmlFor="postImage" className="form-label">
              Image
            </label>
            <input
              type="file"
              id="postImage"
              name="postImage"
              onChange={handleImageChange}
              className={`form-input ${errors.postImage ? "input-error" : ""}`}
              accept="image/*"
              disabled={isLoading}
            />
            {errors.postImage && (
              <span className="error-message">{errors.postImage}</span>
            )}
            <p className="input-hint">
              Select a JPG, PNG or WEBP image up to 5MB
            </p>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
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
{isLoading &&  <div style={{textAlign:"center"}}>
            <DNA
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
            <p>Uploading .... Please Wait</p>
          </div> }
        

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
