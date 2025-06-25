// food/foodController.js
import { Food } from "./foodModel.js";

// POST /api/foods
export const createFood = async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json({ message: "Food created", data: food });
  } catch (err) {
    res.status(500).json({ message: "Error creating food", error: err.message });
  }
};

// GET /api/foods
export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate("dishType");
    res.status(200).json({ data: foods });
  } catch (err) {
    res.status(500).json({ message: "Error fetching foods", error: err.message });
  }
};
