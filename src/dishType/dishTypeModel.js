// dishType/dishTypeModel.js
import mongoose from "mongoose";

const dishTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export const DishType = mongoose.model("DishType", dishTypeSchema);
