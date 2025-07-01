// user/controllers/userController.js
import jwt from "jsonwebtoken";
import User from "./userModel.js";
import { promisify } from "util";

// Helper: create token and set cookie (unchanged)
const sendToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "Lax", // Recommend 'Lax' or 'None' for development/cross-origin
  });

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role, // Include role in response
    },
  });
};

// Register (unchanged, new user gets 'user' role by default)
export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ success: false, message: "Email already in use" });

    // User gets 'user' role by default from model schema
    const user = await User.create({ fullName, email, password });
    sendToken(user, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login (unchanged)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // When finding user for login, make sure to include password (select('+password'))
    // and then compare password. Role is automatically included by default.
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    sendToken(user, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Logout (unchanged)
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax", // Recommend 'Lax' or 'None'
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Get profile (unchanged, except it now returns role)
export const getProfile = async (req, res) => {
  try {
    // Select all fields except password
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role, // Include role in response
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all users (NEW FUNCTION for admin)
export const getAllUsers = async (req, res) => {
  try {
    // Find all users and select fields you want to expose (excluding sensitive ones)
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      results: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};