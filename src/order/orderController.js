import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      addressId,
      subtotal,
      restaurantCharge,
      deliveryFee,
      total,
      paymentMethod,
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    const order = new Order({
      user: user._id,
      items,
      address,
      subtotal,
      restaurantCharge,
      deliveryFee,
      total,
      paymentMethod,
    });

    await order.save();

    res.status(201).json({ success: true, message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
