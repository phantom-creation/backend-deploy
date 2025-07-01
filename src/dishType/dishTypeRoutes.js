// dishType/dishTypeRoutes.js
import express from "express";
import {
  createDishType,
  getAllDishTypes,
  updateDishType,
  deleteDishType,
} from "./dishTypeController.js";

const router = express.Router();

router.get("/dishTypes", getAllDishTypes);
router.post("/dishTypes", createDishType);

// 🆕 Add these:
router.put("/dishTypes/:id", updateDishType);
router.delete("/dishTypes/:id", deleteDishType);

export default router;
