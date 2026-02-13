const PostModel = require("../models/Post");
const UserModel = require("../models/User");

// desc    get loged in user
// route   GET /api/user/getuser
// access  Private
const getuser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// desc    Update user profile & change password
// route   PUT /api/user/updateprofile
// access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      name,
      boidata,
      profileImage,
      coverImage,
      oldPassword,
      newPassword,
    } = req.body;

    if (name) user.name = name;
    if (boidata) user.boidata = boidata;
    if (profileImage) user.profileImage = profileImage;
    if (coverImage) user.coverImage = coverImage;

    if (oldPassword && newPassword) {
      const isMatch = await user.matchPassword(oldPassword);

      if (!isMatch)
        return res.status(400).json({ message: "Old password is incorrect" });

      user.password = newPassword;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        boidata: user.boidata,
        profileImage: user.profileImage,
        coverImage: user.coverImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// desc    deleteuser and all relates
// route   DELET /api/user/deleteuser
// access  Private
const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // delete all posts
    await PostModel.deleteMany({ user: userId });

    // removing this user from followers / following lists of other
    await UserModel.updateMany(
      { followers: userId },
      { $pull: { followers: userId } },
    );

    await UserModel.updateMany(
      { following: userId },
      { $pull: { following: userId } },
    );

    // deleteing user
    await UserModel.deleteOne({ _id: userId });
    res.json({
      success: true,
      data: user,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// desc    Follower of user
// route   PUT /api/user/followuser
// access  Private
const followUser = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    await UserModel.findByIdAndUpdate(req.user.id, {
      $addToSet: { following: req.params.id },
    });

    await UserModel.findByIdAndUpdate(req.params.id, {
      $addToSet: { followers: req.user.id },
    });

    res.json({ message: "User followed" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// desc    unfollower of user
// route   PUT /api/user/unfollowuser
// access  Private
const unfollowUser = async (req, res) => {
  try {
    await UserModel.findByIdAndUpdate(req.user.id, {
      $pull: { following: req.params.id },
    });

    await UserModel.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user.id },
    });

    res.json({ message: "User unfollowed" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getuser,
  updateProfile,
  deleteUser,
  followUser,
  unfollowUser,
};
