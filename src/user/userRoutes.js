// user/userRoutes.js
import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
} from "./userController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", protect, getProfile); // Protected route

export default router;
