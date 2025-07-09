import express from "express";
import {
  createCheckoutSession,
  handleStripeWebhook,
} from "./paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

export default router;
