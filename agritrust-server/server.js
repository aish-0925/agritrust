require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const farmerRoutes = require("./routes/farmerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const orderRoutes = require("./routes/orderRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const advisoryRoutes = require("./routes/advisoryRoutes");
const cartRoutes = require("./routes/cartRoutes");


const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect database
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/users",userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/orders",orderRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/advisories", advisoryRoutes);
app.use("/api/cart", cartRoutes);


// test route
app.get("/", (req, res) => {
  res.send("AgriTrust API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});