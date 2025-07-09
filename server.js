import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";

import connectDb from "./src/config/dbConfig.js";
import productRoutes from "./src/product/productRoutes.js";
import dishTypeRoutes from "./src/dishType/dishTypeRoutes.js";
import foodRoutes from "./src/food/foodRoutes.js";
import userRoutes from "./src/user/userRoutes.js";
import orderRoutes from "./src/order/orderRoutes.js";

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend.vercel.app",
  "*",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

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
