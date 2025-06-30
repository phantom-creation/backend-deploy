// src/user/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/user/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            provider: "google",
          });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        return done(null, { ...user.toObject(), token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
