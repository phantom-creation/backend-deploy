// dishType/dishTypeRoutes.js
import express from "express";
import { createDishType, getAllDishTypes } from "./dishTypeController.js";

const router = express.Router();

router.get("/dish-types", getAllDishTypes);
router.post("/dish-types", createDishType);

export default router;
