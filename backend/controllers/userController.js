const mongoose = require("mongoose");
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

// desc    get user by id (for viewing other users' profiles)
// route   GET /api/user/:id
// access  Private
const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select("-password");
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

// desc    Search users by name or email
// route   GET /api/user/search?q=searchQuery
// access  Private
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    // Search users by name or email
    const users = await UserModel.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// desc    Get suggested users for the logged-in user
// route   GET /api/user/suggestions
// access  Private
const getSuggestedUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const currentUser =
      await UserModel.findById(currentUserId).select("following");
    const followingList = currentUser?.following || [];

    // Use MongoDB aggregation pipeline for efficient random selection
    const suggestedUsers = await UserModel.aggregate([
      {
        $match: {
          // Exclude current user and users already being followed
          _id: {
            $nin: [
              new mongoose.Types.ObjectId(currentUserId),
              ...followingList,
            ],
          },
        },
      },
      // Randomly sample 5 users
      { $sample: { size: 5 } },
      // Project only necessary fields (exclude password)
      {
        $project: {
          password: 0,
          __v: 0,
        },
      },
    ]);

    res.json({
      success: true,
      count: suggestedUsers.length,
      data: suggestedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// desc    Get followers list for a user
// route   GET /api/user/:id/followers
// access  Private
const getFollowers = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    const user = await UserModel.findById(targetUserId)
      .select("followers")
      .populate("followers", "name profileImage email");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      count: user.followers.length,
      data: user.followers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// desc    Get following list for a user
// route   GET /api/user/:id/following
// access  Private
const getFollowing = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    const user = await UserModel.findById(targetUserId)
      .select("following")
      .populate("following", "name profileImage email");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      count: user.following.length,
      data: user.following,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// desc    set user profile
// route   POST /api/user/uploadprofilepic
// access  Private
const setProfilePic = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res
        .status(400)
        .json({ success: false, error: "Failed to upload profile picture" });
    }

    const userId = req.user.id;
    const profilePicPath = req.file.path;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { profileImage: profilePicPath },
      { new: true },
    );

    console.log({ message: "find the user " });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found try again" });
    }
    console.log({ message: "find the user " });

    res.json({
      success: true,
      message: "Profile pic updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        monthlyBudget: user.monthlyBudget,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: "Cannot upload profile picture due to internal issues",
      message: error.message,
    });
  }
};

// desc    set user cover
// route   POST /api/user/uploadcoverpic
// access  Private
const setCoverPic = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res
        .status(400)
        .json({ success: false, error: "Failed to upload cover image" });
    }

    const userId = req.user.id;
    const coverImagePath = req.file.path;
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { coverImage: coverImagePath },
      { new: true },
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found try again" });
    }

    res.json({
      success: true,
      message: "Cover image updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        coverImage: user.coverImage,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: "Cannot upload cover image due to internal issues",
      message: error.message,
    });
  }
};

module.exports = {
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
  setCoverPic
};
