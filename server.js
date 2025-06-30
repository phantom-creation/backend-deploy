import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";

import connectDb from "./src/config/dbConfig.js";
import productRoutes from "./src/product/productRoutes.js";
import dishTypeRoutes from "./src/dishType/dishTypeRoutes.js";
import foodRoutes from "./src/food/foodRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/api", productRoutes);
app.use("/api", dishTypeRoutes);
app.use("/api", foodRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Product API with Auth");
});

// Connect to MongoDB
connectDb();

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
