import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Logged-in users can create and view their own orders
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);

// Admin-only route to view all orders
router.get("/", protect, admin, getAllOrders);

export default router;
