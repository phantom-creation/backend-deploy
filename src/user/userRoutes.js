// src/user/userRoutes.js
import express from "express";
import passport from "passport";
import "../user/passport.js"; // register passport strategies
import { signup, login, logout } from "./userController.js";

const router = express.Router();

// ----------- Email/Password Routes -------------
router.post("/user/signup", signup);
router.post("/user/login", login);
router.post("/user/logout", logout); // optional, for frontend logout

// ----------- Google OAuth Routes --------------
// Step 1: Redirect to Google login
router.get(
  "/user/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google callback
router.get(
  "/user/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/signin", // or your frontend URL
  }),
  (req, res) => {
    const token = req.user.token;
    const clientURL = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientURL}/auth/callback?token=${token}`);
  }
);

export default router;
