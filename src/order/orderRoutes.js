// src/order/orderRoutes.js
import express from "express";
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, verifyStripePayment } from "./orderController.js";
import { isAdmin, protect } from "../user/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getUserOrders);

router.get("/all", protect, isAdmin, getAllOrders);
router.put("/:id", protect, isAdmin, updateOrderStatus); 

router.post("/verify-payment", verifyStripePayment);

export default router;
