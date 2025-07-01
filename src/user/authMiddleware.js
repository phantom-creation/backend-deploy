// src/user/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "./userModel.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token)
      return res.status(401).json({
        success: false,
        message: "You are not logged in! Please log in to get access.",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.name === "TokenExpiredError"
        ? "Token expired. Please log in again."
        : "Invalid token. Please log in again.",
    });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }
    next();
  };
};
