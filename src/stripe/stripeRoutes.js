// src/stripe/stripeRoutes.js
import express from "express";
import { handleStripeWebhook } from "./stripeController.js";

const router = express.Router();

// Stripe requires raw body here
router.post("/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

export default router;
