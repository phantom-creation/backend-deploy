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
import paymentRoutes from "./src/payment/paymentRoutes.js";
import bodyParser from "body-parser";
import fs from "fs";

dotenv.config();
const app = express();

// Stripe needs raw body for webhook:
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payment/webhook") {
    req.setEncoding("utf8");
    req.rawBody = "";
    req.on("data", (chunk) => {
      req.rawBody += chunk;
    });
    req.on("end", () => {
      next();
    });
  } else {
    express.json()(req, res, next);
  }
});

const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend.vercel.app",
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

app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use("/api", productRoutes);
app.use("/api", dishTypeRoutes);
app.use("/api", foodRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("✅ Restaurant Server Running");
});

connectDb();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
