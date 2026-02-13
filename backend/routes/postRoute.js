const router = require("express").Router();
const protect = require("../middleware/authmiddleware");
const {
  createPost,
  getPost,
  deletePost,
  likePost,
  getFeed
} = require("../controllers/postController");

router.post("/createpost", protect, createPost);
router.get("/getpost/:id", protect, getPost);
router.delete("/deletepost/:id", protect, deletePost);
router.put("/likepost/:id", protect, likePost);
router.get("/feed", protect, getFeed);
module.exports = router;
