// src/user/userRoutes.js
import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  getAllUsers,
  updateProfile,
} from "./userController.js";
import { protect, restrictTo } from "./authMiddleware.js";

const router = express.Router();

// Authentication routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout); // Changed to POST for security

// User profile routes
router.get("/profile", protect, getProfile);
// Update profile route
router.put("/profile", protect, updateProfile);

// Admin-only routes
router.get("/", protect, restrictTo("admin"), getAllUsers); // RESTful: GET /users for all users

export default router;