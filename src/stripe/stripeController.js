// src/stripe/stripeWebhook.js
import Stripe from "stripe";
import { Order } from "../order/orderModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody || req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const session = event.data.object;
  const orderId = session.metadata?.orderId;

  console.log("⚡ Stripe event received:", event.type);

  // ✅ PAYMENT SUCCESS
  if (event.type === "checkout.session.completed") {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: "paid",
          orderStatus: "preparing",
        },
        { new: true }
      );

      if (!updatedOrder) {
        console.error("❌ Order not found for ID:", orderId);
        return res.status(404).send("Order not found");
      }

      console.log("✅ Order marked as paid:", orderId);
    } catch (err) {
      console.error("❌ Error updating order:", err);
      return res.status(500).send("Error updating order");
    }
  }

  // ❌ PAYMENT FAILED or ABANDONED
  if (
    event.type === "checkout.session.expired" ||
    event.type === "payment_intent.payment_failed"
  ) {
    if (orderId) {
      try {
        const deleted = await Order.findByIdAndDelete(orderId);
        if (deleted) {
          console.log("🗑️ Deleted order due to failed/expired payment:", orderId);
        } else {
          console.warn("⚠️ Order not found for deletion:", orderId);
        }
      } catch (err) {
        console.error("❌ Error deleting failed order:", err);
      }
    }
  }

  res.json({ received: true });
};
