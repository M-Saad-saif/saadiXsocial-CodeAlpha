const PostModel = require("../models/Post");

// desc    create post
// route   POST /api/post/createpost
// access  Private
const createPost = async (req, res) => {
  try {
    const post = await PostModel.create({
      user: req.user.id,
      description: req.body.description,
      postImage: req.body.postImage,
    });
    res.json({
      success: true,
      post: post,
      message: "successfully uploaded post",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// desc    get post
// route   GET /api/post/getpost/:id
// access  Private
const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await PostModel.findById(id);
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// desc    delete post
// route   DELETE /api/post/deletepost/:id
// access  Private
const deletePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// desc    like post
// route   PUT /api/post/likepost/:id
// access  Private
const likePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await PostModel.findByIdAndUpdate(req.params.id, {
      $addToSet: { likes: req.user.id },
    });

    res.json({ success: true, message: "Post liked" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPost,
  deletePost,
  likePost,
};
