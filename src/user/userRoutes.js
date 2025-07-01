// src/user/userRoutes.js
import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  getAllUsers,
} from "./userController.js";
import { protect, restrictTo } from "./authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.get("/fetchUserProfile", protect, getProfile);

// Admin-only route
router.get("/allUsers", protect, restrictTo("admin"), getAllUsers);

export default router;
