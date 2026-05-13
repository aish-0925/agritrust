const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const Product = require("../models/Product");


/* Farmer Dashboard Stats */

router.get("/stats", protect, async (req, res) => {
  try {

    const farmerId = req.user.id;

    const totalProducts = await Product.countDocuments({
      farmer: farmerId
    });

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

});

module.exports = router;