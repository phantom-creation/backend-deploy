// productRoutes.js (or any route file)
import { Router } from "express";
import { createProduct, getAllProducts } from "./productController.js";

const router = Router();

router.get("/products", getAllProducts);
router.post("/products", createProduct);

export default router;
