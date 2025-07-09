import express from "express";
import {
  createCheckoutSession,
  handleStripeWebhook,
} from "./paymentController.js";

const router = express.Router();

// Normal routes
router.post("/create-checkout-session", createCheckoutSession);

// Stripe webhook — body must be raw JSON
router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

export default router;
