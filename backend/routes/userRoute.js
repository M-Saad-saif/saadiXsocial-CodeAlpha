const router = require("express").Router();
const protect = require("../middleware/authmiddleware");
const {
  getuser,
  updateProfile,
  deleteUser,
  followUser,
  unfollowUser,
} = require("../controllers/userController");

// protected route
router.get("/getuser", protect, getuser);
router.put("/updateprofile", protect, updateProfile);
router.delete("/deleteuser", protect, deleteUser);
router.put("/followuser/:id", protect, followUser);
router.put("/unfollowuser/:id", protect, unfollowUser);

module.exports = router;
