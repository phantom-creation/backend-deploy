import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
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
    address: {
      label: String,
      houseNumber: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    subtotal: { type: Number, required: true },
    restaurantCharge: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod", "online"], default: "cod" },
    status: { type: String, enum: ["placed", "preparing", "out-for-delivery", "delivered"], default: "placed" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
