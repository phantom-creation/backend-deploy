// src/stripe/stripeController.js
import stripe from "../order/stripe.js";
import { Order } from "../order/orderModel.js";

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Payment successful event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    try {
      const order = await Order.findById(orderId);
      if (!order) {
        console.warn("⚠️ Webhook: Order not found");
        return res.status(404).end();
      }

      order.paymentStatus = "paid";
      await order.save();

      console.log("✅ Order marked as paid:", orderId);
    } catch (err) {
      console.error("🔥 Webhook order update error:", err);
    }
  }

  res.status(200).json({ received: true });
};
