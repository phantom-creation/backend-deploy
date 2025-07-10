// src/stripe/stripeRoutes.js
import express from "express";
import { handleStripeWebhook } from "./stripeController.js";

const router = express.Router();

// No need to use express.raw() again here
router.post("/webhook", handleStripeWebhook);

export default router;
