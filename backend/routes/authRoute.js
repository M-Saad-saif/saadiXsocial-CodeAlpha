const router = require("express").Router();
const protect = require("../middleware/authmiddleware");
const {
  registerUser,
  login,
  updateProfile,
  getuser,
  deleteUser,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", login);

// protected route
router.get("/getuser", protect, getuser);
router.put("/updateprofile", protect, updateProfile);
router.delete("/deleteuser", protect, deleteUser);

module.exports = router;
