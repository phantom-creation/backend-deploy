import jwt from "jsonwebtoken";
import User from "./userModel.js";

// Middleware: protect route
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token not found.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "User not found or token invalid.",
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message:
        err.name === "TokenExpiredError"
          ? "Session expired. Please log in again."
          : "Unauthorized access.",
    });
  }
};

// Middleware: restrict to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission for this action.",
      });
    }
    next();
  };
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admin only" });
  }
};

