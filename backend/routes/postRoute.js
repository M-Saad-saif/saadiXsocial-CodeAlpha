const router = require("express").Router();
const protect = require("../middleware/authmiddleware");
const upload = require("../config/multerConfig");
const {
  createPost,
  uploadPostImage,
  getPost,
  deletePost,
  likePost,
  getFeed,
  getUserPosts,
} = require("../controllers/postController");

router.post("/createpost", protect, createPost);
router.post("/uploadpostimage", protect, upload.single("postImage"), uploadPostImage);
router.get("/getpost/:id", protect, getPost);
router.delete("/deletepost/:id", protect, deletePost);
router.put("/likepost/:id", protect, likePost);
router.get("/feed", protect, getFeed);
router.get("/user/:userId", protect, getUserPosts);

module.exports = router;
