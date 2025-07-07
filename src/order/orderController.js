// src/order/orderController.js
import {Order} from "./orderModel.js";
import {Food} from "../food/foodModel.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodItems, paymentMethod } = req.body;

    if (!foodItems || !foodItems.length) {
      return res.status(400).json({ success: false, message: "No food items provided" });
    }

    let total = 0;

    for (const item of foodItems) {
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res.status(404).json({ success: false, message: "Food not found" });
      }

      let basePrice = food.isSizeBased
        ? food.priceOptions.find((opt) => opt.size === item.size)?.price
        : food.price;

      if (basePrice === undefined) {
        return res.status(400).json({ success: false, message: "Invalid size/price" });
      }

      let addonsTotal = item.selectedAddons?.reduce((sum, a) => sum + a.price, 0) || 0;

      total += (basePrice + addonsTotal) * item.quantity;
    }

    const order = new Order({
      userId,
      foodItems,
      totalPrice: parseFloat(total.toFixed(2)),
      paymentMethod,
      paymentStatus: paymentMethod === "online" ? "pending" : "paid",
    });

    await order.save();

    res.status(201).json({ success: true, message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get User Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
