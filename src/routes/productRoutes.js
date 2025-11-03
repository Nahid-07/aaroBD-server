import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Public Routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin Routes (we’ll protect later)
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
