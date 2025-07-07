import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addressId: { type: mongoose.Schema.Types.ObjectId, required: true },

    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
        size: String,
        addons: [
          {
            name: String,
            price: Number,
          },
        ],
        total: Number,
      },
    ],

    totalPrice: { type: Number, required: true },

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
  },
  { timestamps: true }
);  

export default mongoose.model("Order", orderSchema);
