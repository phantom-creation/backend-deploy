// dishType/dishTypeRoutes.js
import express from "express";
import {
  createDishType,
  getAllDishTypes,
  updateDishType,
  deleteDishType,
} from "./dishTypeController.js";

const router = express.Router();

router.get("/dish-types", getAllDishTypes);
router.post("/dish-types", createDishType);

// 🆕 Add these:
router.put("/dish-types/:id", updateDishType);
router.delete("/dish-types/:id", deleteDishType);

export default router;
