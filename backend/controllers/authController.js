const UserModel = require("../models/User");
const PostModel = require("../models/Post");
const jwt = require("jsonwebtoken");

// generating token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECURE, {
    expiresIn: process.env.JWT_EXPIRE || "20d",
  });
};

// desc  ->    Register new user
// route  ->   POST /api/auth/register
// access  ->  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //   if any fired is not described
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Provide all feilds" });
    }

    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exist",
      });
    }

    const user = await UserModel.create({
      name,
      email,
      password,
    });

    if (user) {
      res.json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          token: generateToken(user._id),
        },
        message: "user created successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// desc  ->    Login user
// route  ->   POST /api/auth/login
// access  ->  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "wrong credentials",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user || (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
        message: "login successfully",
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// desc    get loged in user
// route   GET /api/auth/getuser
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
// route   PUT /api/auth/updateprofile
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
// route   DELET /api/auth/deleteuser
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
    await UserModel.deleteOne();
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  login,
  getuser,
  updateProfile,
  deleteUser,
};
