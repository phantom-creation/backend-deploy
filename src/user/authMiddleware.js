// user/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "./userModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.token) { // <--- Changed from 'jwt' to 'token'
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false, // Match your backend's response format
        message: 'You are not logged in! Please log in to get access.',
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token does no longer exist.',
      });
    }

    req.user = currentUser; // Attach user to the request object
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again!',
      });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your token has expired! Please log in again.',
      });
    }
    console.error('Error in protect middleware:', err);
    res.status(500).json({
      success: false,
      message: 'An unexpected authentication error occurred.',
    });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user should be populated by the 'protect' middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};