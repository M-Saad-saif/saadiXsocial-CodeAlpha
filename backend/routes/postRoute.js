const router = require("express").Router();
const protect = require("../middleware/authmiddleware");
const {
  createPost,
  getPost,
  deletePost,
  likePost,
  getFeed,
  getUserPosts,
} = require("../controllers/postController");

router.post("/createpost", protect, createPost);
router.get("/getpost/:id", protect, getPost);
router.delete("/deletepost/:id", protect, deletePost);
router.put("/likepost/:id", protect, likePost);
router.get("/feed", protect, getFeed);
router.get("/user/:userId", protect, getUserPosts);

module.exports = router;
