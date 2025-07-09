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
  getAddresses,
  updateAddress,
  deleteAddress,
} from "./addressController.js";

import { isAdmin, protect } from "./authMiddleware.js";

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// User profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/all", protect, isAdmin, getAllUsers);

// Address CRUD
router.get("/addresses", protect, getAddresses);
router.post("/address", protect, addAddress);
router.delete("/address/:addressId", protect, deleteAddress);
router.put("/address/:addressId", protect, updateAddress);

export default router;
