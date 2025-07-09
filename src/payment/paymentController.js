import stripe from "./stripe.js";
import { Order } from "../order/orderModel.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { userId, foodItems, totalPrice, paymentMethod, addressId } = req.body;

    const order = await Order.create({
      userId,
      foodItems,
      totalPrice,
      paymentMethod,
      addressId,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      orderStatus: "placed",
    });

    if (paymentMethod === "cod") {
      return res.status(200).json({ message: "Order placed successfully", orderId: order._id });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Restaurant Order" },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success?orderId=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    order.paymentSessionId = session.id;
    await order.save();

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};

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
    console.error("Stripe Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    try {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
      });
      console.log("✅ Order marked as paid:", orderId);
    } catch (err) {
      console.error("❌ Error updating order:", err.message);
    }
  }

  res.status(200).json({ received: true });
};
