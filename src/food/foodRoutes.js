// food/foodRoutes.js
import express from "express";
import { createFood, getAllFoods } from "./foodController.js";

const router = express.Router();

router.get("/foods", getAllFoods);
router.post("/foods", createFood);

export default router;
