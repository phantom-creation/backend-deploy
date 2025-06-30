// src/user/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    provider: { type: String, default: "local" },
    googleId: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
