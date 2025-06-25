// dishType/dishTypeController.js
import { DishType } from "./dishTypeModel.js";

// POST /api/dish-types
export const createDishType = async (req, res) => {
  try {
    const dishType = new DishType(req.body);
    await dishType.save();
    res.status(201).json({ message: "Dish type created", data: dishType });
  } catch (err) {
    res.status(500).json({ message: "Error creating dish type", error: err.message });
  }
};

// GET /api/dish-types
export const getAllDishTypes = async (req, res) => {
  try {
    const types = await DishType.find();
    res.status(200).json({ data: types });
  } catch (err) {
    res.status(500).json({ message: "Error fetching dish types", error: err.message });
  }
};
