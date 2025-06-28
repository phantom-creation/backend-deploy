// food/foodController.js
import { Food } from "./foodModel.js";

// POST /api/foods
export const createFood = async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json({ message: "Food created", data: food });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating food", error: err.message });
  }
};

// GET /api/foods
export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate("dishType");
    res.status(200).json({ data: foods });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching foods", error: err.message });
  }
};

// PUT /api/foods/:id
export const updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json({ message: "Food updated", data: food });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating food", error: err.message });
  }
};

// DELETE /api/foods/:id
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json({ message: "Food deleted", data: food });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting food", error: err.message });
  }
};
