import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    category: {
      type: String,
      enum: ["Oversized", "Minimal", "Graphic"],
      required: true,
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
      default: "Unisex",
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      min: [0, "Price cannot be negative"],
    },
    sizes: {
      type: [String],
      enum: ["M", "L", "XL"],
      default: ["M", "L"],
    },
    colors: {
      type: [String],
      required: true,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/400x400.png?text=Aaro+Tee",
    },
    inStock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
