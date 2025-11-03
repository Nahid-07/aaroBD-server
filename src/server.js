import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import testRoute from "./routes/text.route.js"
import authRoute from "./routes/auth.route.js";
import productRoutes from "./routes/productRoutes.js"

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/test", testRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoutes);

// DB + Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
