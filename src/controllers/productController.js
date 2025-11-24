import Product from "../models/productModel.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      gender,
      price,
      sizes,
      colors,
      image,
      inStock,
      rating,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const product = await Product.create({
      name,
      description,
      category,
      gender,
      price,
      sizes,
      colors,
      image,
      inStock,
      rating,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Products (with Pagination & Filters)
export const getProducts = async (req, res) => {
  try {
    const pageSize = 8; // Number of products per page
    const page = Number(req.query.page) || 1;

    // 1. Search Filter (by Name)
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i", // Case insensitive
          },
        }
      : {};

    // 2. Category Filter
    const category =
      req.query.category && req.query.category !== "All"
        ? { category: req.query.category }
        : {};

    // 3. Gender Filter
    const gender =
      req.query.gender && req.query.gender !== "All"
        ? { gender: req.query.gender }
        : {};

    // 4. Sorting Logic
    let sort = { createdAt: -1 }; // Default: Newest first
    if (req.query.sort === "lowToHigh") sort = { price: 1 };
    if (req.query.sort === "highToLow") sort = { price: -1 };

    // Combine all filters
    const query = { ...keyword, ...category, ...gender };

    // Get Total Count (for pagination)
    const count = await Product.countDocuments(query);

    // Fetch Actual Data
    const products = await Product.find(query)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product details" });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Product Review
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if user already reviewed
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: "Product already reviewed" });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      // Calculate Average Rating
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
