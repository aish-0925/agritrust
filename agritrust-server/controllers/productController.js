// controllers/productController.js

const Product = require("../models/Product");
const User = require("../models/User");

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
  subCategory,

  price,
  quantity,
  unit,

  minOrderQuantity,
  stockAlertThreshold,

  description,

  organic,

  harvestDate,
  availableTill,

  shelfLife,
  storageInstructions,

  farmName,
  village,
  district,

  certifications,
  nutritionalTags,

  bulkPricing,

  status

} = req.body;

    /* VALIDATE ONLY PUBLISHED PRODUCTS */

if (
  status === "published" &&
  (!name || !price || !quantity)
) {

  return res.status(400).json({
    message:
      "Name, price and quantity are required"
  });

}

    const images = req.files?.map(file => `/uploads/${file.filename}`) || [];
    const product = await Product.create({

  name,
  category,
  subCategory,

  price,
  quantity,
  unit,

  minOrderQty: minOrderQuantity,

  stockAlertThreshold,

  description,

  organic,

  harvestDate,
  availableTill,

  shelfLife,
  storageInstructions,

  certifications: certifications
    ? JSON.parse(certifications)
    : [],

  nutritionalTags: nutritionalTags
    ? JSON.parse(nutritionalTags)
    : [],

  bulkPricing: bulkPricing
    ? JSON.parse(bulkPricing)
    : [],

  farmer: req.user.id,

  farmName,

  village,
  district,

  farmLocation: {
    farmName,
    village,
    district
  },

  images,

  status: status || "draft",

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
  "subCategory",

  "price",
  "quantity",
  "unit",

  "description",

  "organic",

  "harvestDate",
  "availableTill",

  "shelfLife",
  "storageInstructions",

  "farmName",
  "village",
  "district",

  "stockAlertThreshold",

  "status" 
];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    /* HANDLE ARRAY FIELDS */

if (req.body.certifications) {
  product.certifications =
    JSON.parse(req.body.certifications);
}

if (req.body.nutritionalTags) {
  product.nutritionalTags =
    JSON.parse(req.body.nutritionalTags);
}

if (req.body.bulkPricing) {
  product.bulkPricing =
    JSON.parse(req.body.bulkPricing);
}

/* UPDATE FARM LOCATION */

product.farmLocation = {

  farmName: req.body.farmName,

  village: req.body.village,

  district: req.body.district

};
console.log("REQ STATUS:", req.body.status);
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
      district,
      minPrice,
      maxPrice,
      qualityGrade
    } = req.query;

    let query = {
      quantity: { $gt: 0 },
      status: "published"
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
      query.name = {
        $regex: search,
        $options: "i"
      };
    }

    if (district) {
      query["farmLocation.district"] = {
        $regex: district,
        $options: "i"
      };
    }

    /* PRICE RANGE */

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    /* QUALITY */

    if (qualityGrade) {
      query.qualityGrade = qualityGrade;
    }

    /* ================= FETCH ================= */

    let products = await Product.find(query)
      .populate("farmer", "name farmName")
      .sort({ createdAt: -1 })
      .lean();

    /* ================= SORT ================= */

    switch (sort) {

      case "price_low":
        products.sort((a, b) => a.price - b.price);
        break;

      case "price_high":
        products.sort((a, b) => b.price - a.price);
        break;

      case "rating_high":
        products.sort((a, b) => b.rating - a.rating);
        break;

      case "trust_high":
        products.sort((a, b) => b.trustScore - a.trustScore);
        break;

      case "freshest":
        products.sort(
          (a, b) =>
            new Date(b.harvestDate || 0) -
            new Date(a.harvestDate || 0)
        );
        break;
    }

    /* ================= FORMAT ================= */

    const formatted = products.map(p => ({

      _id: p._id,
      productId: p.productId,

      name: p.name,
      category: p.category,
      subCategory: p.subCategory,

      description: p.description,

      /* MEDIA */
      images: p.images || [],
      image: p.images?.[0] || "",

      /* PRICING */
      price: p.price,
      quantity: p.quantity,
      unit: p.unit,

      minOrderQty: p.minOrderQty,

      bulkPricing: p.bulkPricing || [],

      /* QUALITY */
      qualityGrade: p.qualityGrade,
      organic: p.organic,

      /* TRUST */
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      trustScore: p.trustScore,

      /* STOCK */
      stockStatus: p.stockStatus,
      isLowStock: p.quantity < 20,

      /* DELIVERY */
      deliveryAvailable: p.deliveryAvailable,

      /* FARM INFO */
      farmName: p.farmName,

      farmer:
        p.farmName ||
        p.farmer?.farmName ||
        p.farmer?.name,

      village: p.farmLocation?.village || "",
      district: p.farmLocation?.district || "",
      state: p.farmLocation?.state || "",

      /* DATES */
      harvestDate: p.harvestDate,
      availableTill: p.availableTill,

      shelfLife: p.shelfLife,
      storageInstructions:
        p.storageInstructions,

      /* TAGS */
      certifications: p.certifications || [],
      nutritionalTags:
        p.nutritionalTags || []
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

/* ───────── PUBLIC PRODUCT DETAILS ───────── */

exports.getPublicProductById = async (
  req,
  res
) => {

  try {

    const product = await Product.findOne({

      _id: req.params.id,

      status: "published"

    }).populate(
      "farmer",
      "name farmName"
    );

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

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ───────── ADD REVIEW ───────── */

exports.addReview = async (req, res) => {

  try {

    const { rating, comment } = req.body;

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    /* CHECK EXISTING REVIEW */

    const alreadyReviewed =
      product.reviews.find(
        (r) =>
          r.restaurant?.toString() ===
          req.user.id
      );

    if (alreadyReviewed) {

      return res.status(400).json({
        success: false,
        message:
          "You already reviewed this product"
      });
    }

    /* CREATE REVIEW */

    const restaurantUser =
  await User.findById(req.user.id);

const review = {

  restaurant: req.user.id,

  name:
    restaurantUser.restaurantName ||
    restaurantUser.name ||
    "Restaurant User",

  rating: Number(rating),

  comment
};

    product.reviews.push(review);

    /* UPDATE REVIEW STATS */

    product.reviewsCount =
      product.reviews.length;

    product.rating =
      product.reviews.reduce(
        (acc, item) =>
          item.rating + acc,
        0
      ) / product.reviews.length;

    await product.save();

    res.json({
      success: true,
      message:
        "Review added successfully",
      product
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ───────── UPDATE REVIEW ───────── */

exports.updateReview = async (req, res) => {

  try {

    const { rating, comment } = req.body;

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const review = product.reviews.find(
      (r) =>
        r.restaurant.toString() ===
        req.user.id
    );

    if (!review) {

      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    review.rating = Number(rating);

    review.comment = comment;

    /* RECALCULATE */

    product.rating =
      product.reviews.reduce(
        (acc, item) =>
          acc + item.rating,
        0
      ) / product.reviews.length;

    await product.save();

    res.json({
      success: true,
      message:
        "Review updated successfully",
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ───────── DELETE REVIEW ───────── */

exports.deleteReview = async (req, res) => {

  try {

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    product.reviews =
      product.reviews.filter(
        (r) =>
          r.restaurant.toString() !==
          req.user.id
      );

    /* UPDATE STATS */

    product.reviewsCount =
      product.reviews.length;

    product.rating =
      product.reviews.length > 0
        ? product.reviews.reduce(
            (acc, item) =>
              acc + item.rating,
            0
          ) / product.reviews.length
        : 0;

    await product.save();

    res.json({
      success: true,
      message:
        "Review deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};