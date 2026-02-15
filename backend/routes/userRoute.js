const router = require("express").Router();
const protect = require("../middleware/authmiddleware");
const upload = require("../config/multerConfig");
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
  setProfilePic,
  setCoverPic,
} = require("../controllers/userController");

router.get("/getuser", protect, getuser);
router.put("/updateprofile", protect, updateProfile);
router.delete("/deleteuser", protect, deleteUser);
router.put("/followuser/:id", protect, followUser);
router.put("/unfollowuser/:id", protect, unfollowUser);
router.get("/search", protect, searchUsers);
router.get("/suggestions", protect, getSuggestedUsers);
router.get("/:id/followers", protect, getFollowers);
router.get("/:id/following", protect, getFollowing);
router.post("/uploadprofilepic", protect, upload.single("profilePic"), setProfilePic);
router.post("/uploadcoverpic", protect, upload.single("coverPic"), setCoverPic);
router.get("/:id", protect, getUserById);

module.exports = router;
