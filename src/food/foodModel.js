// food/foodModel.js
import mongoose from "mongoose";

const addonSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const priceOptionSchema = new mongoose.Schema({
  size: String,
  price: Number,
});

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ["Veg", "Non-Veg"], required: true },
    dishType: { type: mongoose.Schema.Types.ObjectId, ref: "DishType", required: true },

    isSizeBased: { type: Boolean, default: false },
    price: { type: Number }, // Only for non-size-based food
    priceOptions: [priceOptionSchema], // Only for size-based food

    addons: [addonSchema],
    image: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Food = mongoose.model("Food", foodSchema);
