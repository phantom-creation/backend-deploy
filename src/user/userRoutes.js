// user/routes/userRoutes.js
import express from "express";
import * as userController from "./userController.js";
import * as authMiddleware from "./authMiddleware.js";

const router = express.Router();

// Public routes for authentication
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);

// Protected route to fetch current user profile
router.get(
  "/fetchUserProfile",
  authMiddleware.protect,
  userController.getProfile
);

// Admin-only route to fetch all users
router.get(
  "/allUsers",
  authMiddleware.protect, // First, ensure user is authenticated
  authMiddleware.restrictTo("admin"), // Then, ensure user has 'admin' role
  userController.getAllUsers
);

export default router;
