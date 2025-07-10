// src/order/orderController.js
import stripe from "./stripe.js";
import { Order } from "./orderModel.js";
import { Food } from "../food/foodModel.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodItems, paymentMethod, addressId } = req.body;

    if (!foodItems?.length) {
      return res
        .status(400)
        .json({ success: false, message: "No food items provided" });
    }

    let total = 0;
    const lineItems = [];

    for (const item of foodItems) {
      const food = await Food.findById(item.foodId);
      if (!food)
        return res
          .status(404)
          .json({ success: false, message: "Food not found" });

      const basePrice = food.isSizeBased
        ? food.priceOptions.find((opt) => opt.size === item.size)?.price
        : food.price;

      if (basePrice === undefined) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid size/price" });
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
          unit_amount: Math.round((basePrice + addonsTotal) * 100), // price in paise
        },
        quantity: item.quantity,
      });
    }

    // Save initial order
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

    // For COD, respond now
    if (paymentMethod === "cod") {
      return res
        .status(201)
        .json({ success: true, message: "Order placed", order });
    }

    // Create Stripe Checkout Session
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

    // Save session ID in order
    order.paymentSessionId = session.id;
    await order.save();

    // Send session ID to frontend
    res.status(200).json({
      success: true,
      message: "Stripe session created",
      sessionId: session.id,
    });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("foodItems.foodId") // ✅ populate food details
      .lean();

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get User Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get all orders for admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email") // Show basic user info
      .populate("foodItems.foodId") // Include food details
      .lean();

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("Admin Get Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

// Update order status or payment status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({ success: true, message: "Order updated", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
