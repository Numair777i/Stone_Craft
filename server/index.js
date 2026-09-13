const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payments");
const wishlistRoutes = require("./routes/wishlist");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.get("/", (req, res) => {
  res.send("Stone._.Craft API is running...");
});

// Database Connection & Server Startup
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/stone_craft";

mongoose.set("strictQuery", false);

mongoose
  .connect(MONGO_URI, {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
    console.error("Make sure MONGO_URI is set in environment variables.");
    console.error("Expected format: mongodb+srv://user:pass@cluster.mongodb.net/dbname");
    // Don't exit — allow server to start anyway for health checks
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (database disconnected)`);
    });
  });

