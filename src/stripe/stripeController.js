// src/stripe/stripeWebhook.js
import Stripe from "stripe";
import { Order } from "../order/orderModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    // Make sure you're using the raw body, not parsed JSON
    event = stripe.webhooks.constructEvent(
      req.rawBody || req.body, // Try both in case rawBody middleware isn't working
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("Received webhook event:", event.type);

  // Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    console.log("Processing payment for order:", orderId);

    try {
      // Add more detailed logging and error handling
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: "paid",
          orderStatus: "preparing", // Optional: also update order status
        },
        { new: true } // Return the updated document
      );

      if (!updatedOrder) {
        console.error("❌ Order not found for ID:", orderId);
        return res.status(404).send("Order not found");
      }

      console.log("✅ Order marked as paid:", orderId);
      console.log("Updated order:", updatedOrder);
    } catch (err) {
      console.error("❌ Error updating order:", err);
      return res.status(500).send("Error updating order");
    }
  }

  // Handle payment failure
  if (event.type === "checkout.session.expired" || event.type === "payment_intent.payment_failed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: "failed",
        });
        console.log("❌ Order marked as failed:", orderId);
      } catch (err) {
        console.error("Error updating failed order:", err);
      }
    }
  }

  res.json({ received: true });
};