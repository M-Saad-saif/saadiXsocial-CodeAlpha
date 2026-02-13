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
} = require("../controllers/userController");

// protected routes - specific routes first, then :id routes
router.get("/getuser", protect, getuser);
router.put("/updateprofile", protect, updateProfile);
router.delete("/deleteuser", protect, deleteUser);
router.put("/followuser/:id", protect, followUser);
router.put("/unfollowuser/:id", protect, unfollowUser);
router.get("/search", protect, searchUsers);

// generic user by id route - must be last to not interfere with other routes
router.get("/:id", protect, getUserById);

module.exports = router;
