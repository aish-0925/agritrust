const Product = require("../models/Product");

/* ==============================
   Farmer Dashboard Stats
================================ */

exports.getFarmerStats = async (req, res) => {
  try {

    const farmerId = req.user.id;

    const totalProducts = await Product.countDocuments({ farmer: farmerId });

    const availableProducts = await Product.countDocuments({
      farmer: farmerId,
      isAvailable: true
    });

    const lowStockProducts = await Product.countDocuments({
      farmer: farmerId,
      availableQuantity: { $lt: 10 }
    });

    res.json({
      totalProducts,
      availableProducts,
      lowStockProducts
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ==============================
   Add Product
================================ */

exports.addProduct = async (req, res) => {
  try {

    const {
      name,
      category,
      price,
      quantity,
      unit,
      minOrderQuantity,
      harvestDate,
      expiryDate,
      description,
      location
    } = req.body;

    const product = new Product({
      farmer: req.user.id,
      name,
      category,
      price,
      quantity,
      unit,
      minOrderQuantity,
      harvestDate,
      expiryDate,
      description,
      location
    });

    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ==============================
   Get Farmer Products
================================ */

exports.getFarmerProducts = async (req, res) => {
  try {

    const products = await Product.find({ farmer: req.user.id })
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ==============================
   Update Product
================================ */

exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        farmer: req.user.id
      },
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/* ==============================
   Delete Product
================================ */

exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user.id
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};