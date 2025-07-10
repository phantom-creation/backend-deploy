// src/stripe/stripeWebhook.js
import Stripe from "stripe";
import { Order } from "../order/orderModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    try {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
      });
      console.log("✅ Order marked as paid:", orderId);
    } catch (err) {
      console.error("Error updating order:", err);
    }
  }

  res.json({ received: true });
};
