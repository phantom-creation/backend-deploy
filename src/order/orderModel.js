// src/order/orderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    foodItems: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        size: { type: String }, // optional
        quantity: { type: Number, required: true },
        selectedAddons: [
          {
            name: String,
            price: Number,
          },
        ],
      },
    ],

    totalPrice: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "preparing",
        "out-for-delivery",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
