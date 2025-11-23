import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
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
    price: { type: Number, required: true, min: 0 },
    sizes: { type: [String], enum: ["M", "L", "XL"], default: ["M", "L"] },
    colors: { type: [String], required: true },
    image: { type: String, required: true },
    inStock: { type: Number, default: 0 },

    // Review System
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 }, // Average Rating
    numReviews: { type: Number, default: 0 }, // Total Count
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
