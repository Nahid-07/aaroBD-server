import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {protect, admin} from "../middleware/authMiddleware.js"

const router = express.Router();

// Public Routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// 🔒 Protected routes (admin only)
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
