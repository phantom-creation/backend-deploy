import express from "express";
import { placeOrder, getOrders } from "./orderController.js";
import { protect } from "../user/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getOrders);

export default router;
