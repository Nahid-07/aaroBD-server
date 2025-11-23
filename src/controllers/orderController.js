import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, shippingInfo, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // 1. Validate Stock & Decrement
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (product.inStock < item.quantity) {
        return res.status(400).json({ message: `Out of Stock: ${product.name}` });
      }

      // Reduce stock
      product.inStock -= item.quantity;
      await product.save();
    }

    // 2. Create the Order
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingInfo,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in user's orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 }); // Newest first
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 }); // Newest first
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Order Status (Admin Only)
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Logic: If cancelling, return items to stock
    if (req.body.status === "Cancelled" && order.status !== "Cancelled") {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.inStock += item.quantity; // Add back to stock
          await product.save();
        }
      }
    }

    // Update status
    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();

    // Populate data again so Frontend doesn't break
    await updatedOrder.populate("user", "name email");
    await updatedOrder.populate("items.product", "name price image");

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};