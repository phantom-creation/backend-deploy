// src/order/orderRoutes.js
import express from "express";
import { placeOrder, getUserOrders } from "./orderController.js";
import { protect } from "../user/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getUserOrders);

export default router;
