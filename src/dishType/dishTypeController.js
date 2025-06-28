// dishType/dishTypeController.js
import { Food } from "../food/foodModel.js";
import { DishType } from "./dishTypeModel.js";

// POST /api/dish-types
export const createDishType = async (req, res) => {
  try {
    const dishType = new DishType(req.body);
    await dishType.save();
    res.status(201).json({ message: "Dish type created", data: dishType });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating dish type", error: err.message });
  }
};

// GET /api/dish-types
export const getAllDishTypes = async (req, res) => {
  try {
    const types = await DishType.find();
    res.status(200).json({ data: types });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching dish types", error: err.message });
  }
};

// PUT /api/dish-types/:id
export const updateDishType = async (req, res) => {
  try {
    const updated = await DishType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Dish type not found" });
    }

    res.status(200).json({ message: "Dish type updated", data: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating dish type", error: err.message });
  }
};

// DELETE /api/dish-types/:id
export const deleteDishType = async (req, res) => {
  try {
    // Check if any food is using this dish type
    const foodUsingDishType = await Food.findOne({ dishType: req.params.id });

    if (foodUsingDishType) {
      return res.status(400).json({
        message:
          "Cannot delete. One or more food items are using this dish type.",
      });
    }

    // Proceed to delete the dish type
    const deleted = await DishType.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Dish type not found" });
    }

    res
      .status(200)
      .json({ message: "Dish type deleted successfully", data: deleted });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting dish type", error: err.message });
  }
};
