const router = require("express").Router();
const protect = require("../middleware/authmiddleware");
const {
  getuser,
  getUserById,
  updateProfile,
  deleteUser,
  followUser,
  unfollowUser,
  searchUsers,
  getSuggestedUsers,
  getFollowers,
  getFollowing,
} = require("../controllers/userController");

// protected routes - specific routes first, then :id routes
router.get("/getuser", protect, getuser);
router.put("/updateprofile", protect, updateProfile);
router.delete("/deleteuser", protect, deleteUser);
router.put("/followuser/:id", protect, followUser);
router.put("/unfollowuser/:id", protect, unfollowUser);
router.get("/search", protect, searchUsers);
router.get("/suggestions", protect, getSuggestedUsers);
// followers / following routes must come before generic /:id
router.get("/:id/followers", protect, getFollowers);
router.get("/:id/following", protect, getFollowing);
router.get("/:id", protect, getUserById);

module.exports = router;
