// controllers/productController.js

const Product = require("../models/Product");

/* ───────── CREATE PRODUCT ───────── */
const mongoose = require("mongoose");

exports.createProduct = async (req, res) => {
  try {
    // console.log("USER:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      name,
      category,
      price,
      quantity,
      unit,
      description,
      organic
    } = req.body;

    if (!name || !price || !quantity) {
      return res.status(400).json({
        message: "Name, price and quantity are required"
      });
    }

    const images = req.files?.map(file => `/uploads/${file.filename}`) || [];
    const product = await Product.create({
      name,
      category,
      price,
      quantity,
      unit,
      description,
      organic,
      farmer: req.user.id, 
      images
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ───────── GET SINGLE PRODUCT ───────── */
exports.getProductById = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      farmer: req.user.id   //restrict access
    }).populate("farmer", "name farmName");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


/* ───────── UPDATE PRODUCT ───────── */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Only farmer who created can update
    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Handle new images (optional)
    if (req.files && req.files.length > 0) {
  product.images = req.files.map(file => `/uploads/${file.filename}`);
}

    // Update fields
    const fields = [
      "name",
      "category",
      "price",
      "quantity",
      "unit",
      "description",
      "organic"
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/* ───────── DELETE PRODUCT ───────── */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.farmer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ───────── GET ALL PRODUCTS ───────── */
exports.getProducts = async (req, res) => {
  try {
    //Check authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    //Fetch only this farmer's products
    const products = await Product.find({ farmer: req.user.id })
      .populate("farmer", "name farmName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    console.error(error); //keep only error logs
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

/* ───────── BROWSE PRODUCTS (MARKETPLACE) ───────── */
exports.browseProducts = async (req, res) => {
  try {
    const {
      category,
      organic,
      inStock,
      sort,
      search,
      city
    } = req.query;

    let query = {
  quantity: { $gt: 0 }
};

    /* ================= FILTERS ================= */

    if (category && category.toLowerCase() !== "all") {
  query.category = category.toLowerCase();
}

    if (organic === "true") {
      query.organic = true;
    }

    if (inStock === "true") {
      query.quantity = { $gt: 0 };
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Optional city filter
    if (city) {
      query["farmLocation.city"] = {
        $regex: city,
        $options: "i"
      };
    }

    /* ================= FETCH ================= */

    const products = await Product.find(query)
      .populate("farmer", "name farmName")
      .sort({ createdAt: -1 })
      .lean();

    /* ================= SORT ================= */

    if (sort === "price_low") {
      products.sort((a, b) => a.price - b.price);
    }

    if (sort === "price_high") {
      products.sort((a, b) => b.price - a.price);
    }

    /* ================= FORMAT ================= */

    const formatted = (products || []).map(p => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      unit: p.unit,
      image: p.images?.[0] || "",
      organic: p.organic,
      stock: p.quantity,
      isLowStock: p.quantity < 20,
      farmer: p.farmName || p.farmer?.farmName || p.farmer?.name,
      city: p.farmLocation?.city || ""
    }));

    res.json({
      success: true,
      count: formatted.length,
      products: formatted
    });

  } catch (error) {
    console.error("BROWSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};