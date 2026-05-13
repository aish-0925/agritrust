const Order = require("../models/Order");
const Product = require("../models/Product");

exports.getRestaurantStats = async (req, res) => {
  try {
    const restaurantId = req.user.id;

    const orders = await Order.find({ restaurant: restaurantId })
      .populate("items.product");

    const totalOrders = orders.length;

    const totalSpend = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    // Unique farmers (suppliers)
    const suppliers = new Set();

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product?.farmer) {
          suppliers.add(item.product.farmer.toString());
        }
      });
    });

    res.json({
      activeSuppliers: suppliers.size,
      ordersThisMonth: totalOrders, // you can filter by month later
      totalSpend,
      freshnessScore: 9.2 // static for now
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMarketplaceProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("farmer", "name farmName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No items in order"
      });
    }

    let totalPrice = 0;

    const populatedItems = [];

    for (let item of items) {
      const product = await Product.findById(item.product);

      if (!product) continue;

      const itemTotal = product.price * item.quantity;

      totalPrice += itemTotal;

      populatedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const OrderModel = require("../models/Order");

    const order = await OrderModel.create({
      restaurant: req.user.id,
      items: populatedItems,
      totalPrice,
      status: "pending"
    });

    res.status(201).json({
      success: true,
      order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

