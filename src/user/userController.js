// user/userController.js
import jwt from "jsonwebtoken";
import User from "./userModel.js";

// Helper: create token and set cookie
const sendToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "strict",
  });

  res.status(200).json({
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  });
};

// Register
export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ fullName, email, password });
    sendToken(user, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: "Invalid email or password" });

    sendToken(user, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// Protected route example
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.status(200).json(user);
};
