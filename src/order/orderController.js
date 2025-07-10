// src/order/orderController.js
import stripe from "./stripe.js";
import { Order } from "./orderModel.js";
import { Food } from "../food/foodModel.js";

// ✅ VERIFY STRIPE PAYMENT — Called after success redirect
export const verifyStripePayment = async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ success: false, message: "Session ID missing" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const orderId = session?.metadata?.orderId;
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Invalid session metadata" });
    }

    if (session.payment_status === "paid") {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: "paid",
          orderStatus: "preparing", // or 'confirmed'
        },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified and order updated",
        order: updatedOrder,
      });
    }

    return res.status(400).json({ success: false, message: "Payment not completed" });
  } catch (err) {
    console.error("❌ Stripe Verification Error:", err);
    return res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

// ✅ PLACE ORDER (COD or Stripe)
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { foodItems, paymentMethod, addressId } = req.body;

    if (!foodItems?.length) {
      return res.status(400).json({ success: false, message: "No food items provided" });
    }

    let total = 0;
    const lineItems = [];

    for (const item of foodItems) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res.status(404).json({ success: false, message: "Food not found" });
      }

      const basePrice = food.isSizeBased
        ? food.priceOptions.find((opt) => opt.size === item.size)?.price
        : food.price;

      if (basePrice === undefined) {
        return res.status(400).json({ success: false, message: "Invalid size/price" });
      }

      const addonsTotal =
        item.selectedAddons?.reduce((sum, a) => sum + a.price, 0) || 0;
      const itemTotal = (basePrice + addonsTotal) * item.quantity;
      total += itemTotal;

      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: food.name + (item.size ? ` (${item.size})` : ""),
          },
          unit_amount: Math.round((basePrice + addonsTotal) * 100),
        },
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      userId,
      foodItems,
      totalPrice: parseFloat(total.toFixed(2)),
      paymentMethod,
      paymentStatus: paymentMethod === "online" ? "pending" : "paid",
      orderStatus: "placed",
      paymentSessionId: null,
      addressId,
    });

    if (paymentMethod === "cod") {
      return res.status(201).json({ success: true, message: "Order placed", order });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      customer_email: req.user.email,
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    order.paymentSessionId = session.id;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Stripe session created",
      sessionId: session.id,
    });
  } catch (err) {
    console.error("❌ Stripe Checkout Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET ALL ORDERS FOR USER
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("foodItems.foodId")
      .lean();

    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Get User Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ✅ ADMIN: GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email")
      .populate("foodItems.foodId")
      .lean();

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("❌ Admin Get Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

// ✅ ADMIN: UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({ success: true, message: "Order updated", order });
  } catch (err) {
    console.error("❌ Update Order Status Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
