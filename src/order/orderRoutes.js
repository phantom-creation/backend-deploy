import express from "express";
import { placeOrder } from "./orderController.js";
import { protect } from "../user/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);

export default router;
