// food/foodRoutes.js
import express from "express";
import {
  createFood,
  getAllFoods,
  updateFood,
  deleteFood,
} from "./foodController.js";

const router = express.Router();

router.get("/foods", getAllFoods);
router.post("/foods", createFood);
router.put("/foods/:id", updateFood);
router.delete("/foods/:id", deleteFood);

export default router;
