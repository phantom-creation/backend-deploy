import express from "express";
import passport from "passport";
import "../user/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// @route   GET /api/user/google
// @desc    Start Google OAuth
router.get(
  "/user/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// @route   GET /api/user/google/callback
// @desc    Google OAuth callback
router.get(
  "/user/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/signin" }),
  (req, res) => {
    // Redirect or send token to client
    const token = req.user.token;
    const clientURL = process.env.CLIENT_URL || "http://localhost:5173";

    // Redirect to client with token as query (or use cookie/header)
    res.redirect(`${clientURL}/auth/callback?token=${token}`);
  }
);

export default router;
