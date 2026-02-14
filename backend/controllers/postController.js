const PostModel = require("../models/Post");
const UserModel = require("../models/User.js");

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

// desc    streamline post
// route   PUT /api/post/feed
// access  Private
const getFeed = async (req, res) => {
  const user = await UserModel.findById(req.user.id);

  const posts = await PostModel.find({
    user: { $in: [...user.following, req.user.id] },
  })
    .populate("user", "name profileImage")
    .sort({ createdAt: -1 });

  res.json(posts);
};

// desc    Get all posts by a specific user
// route   GET /api/post/user/:userId
// access  Private
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const posts = await PostModel.find({ user: userId })
      .populate("user", "name profileImage email")
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
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
  getFeed,
  getUserPosts,
};
