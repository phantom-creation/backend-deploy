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

import {
  addAddress,
  updateAddress,
  deleteAddress,
} from "./addressController.js";

import { protect, restrictTo } from "./authMiddleware.js";

const router = express.Router();


// AUTH ROUTES
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout); // POST for security


// USER PROFILE ROUTES
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);


// ADDRESS ROUTES (Protected)
router.post("/address", protect, addAddress);
router.put("/address/:addressId", protect, updateAddress);
router.delete("/address/:addressId", protect, deleteAddress);


// ADMIN ROUTES
router.get("/", protect, restrictTo("admin"), getAllUsers); // GET /users for admin

export default router;
