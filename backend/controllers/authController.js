const UserModel = require("../models/User");
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


module.exports = {
  registerUser,
  login,
};
