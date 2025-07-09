import express from "express";
import {
  createCheckoutSession,
  handleStripeWebhook,
} from "./paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);

// Webhook — handled with raw body from middleware
router.post("/webhook", handleStripeWebhook);

export default router;
