const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Payment = require("../models/Payment");

/* =========================================================
   PAYMENT TOGGLE
========================================================= */

const ONLINE_PAYMENT =
  process.env.ENABLE_ONLINE_PAYMENT === "true";


/* =========================================================
   CREATE ORDER
========================================================= */

exports.createOrder = async (req, res) => {

  try {

    const {
      items,
      paymentMethod = "cod",
      address,
      billingDetails,
      termsAccepted
    } = req.body;


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!items || items.length === 0) {
      throw new Error("No items provided");
    }

    if (!termsAccepted) {
      throw new Error("Please accept terms");
    }

    if (!address || !address.name || !address.phone || !address.address || !address.city || !address.state || !address.pincode) {
  throw new Error("Invalid delivery address");
}

    if (!billingDetails || !billingDetails.name) {
      throw new Error("Billing details required");
    }


    /* =====================================================
       PAYMENT VALIDATION
    ===================================================== */

    const allowedMethods = ONLINE_PAYMENT
      ? ["cod", "online"]
      : ["cod"];

    if (!allowedMethods.includes(paymentMethod)) {
      throw new Error("Invalid payment method");
    }


    /* =====================================================
       GROUP ITEMS BY FARMER
    ===================================================== */

    const farmerMap = {};

    for (const item of items) {

      if (!item.quantity || item.quantity <= 0) {
        throw new Error("Invalid quantity");
      }

      console.log("ITEM RECEIVED:", item);
      console.log("PRODUCT ID:", item.product);
      const product = await Product.findById(
  item.product
);

if (!product) {
  throw new Error("Product not found");
}

/* CHECK USING QUANTITY */

if (product.quantity <= 0) {

  product.isAvailable = false;

  await product.save();

  throw new Error(
    `${product.name} out of stock`
  );
}

/* AUTO FIX OLD PRODUCTS */

if (!product.isAvailable && product.quantity > 0) {

  product.isAvailable = true;

  await product.save();
}
      
      console.log("FOUND PRODUCT:", product);

      const farmerId = product.farmer.toString();

      if (!farmerMap[farmerId]) {
        farmerMap[farmerId] = [];
      }

      farmerMap[farmerId].push({
        product,
        quantity: item.quantity
      });
    }


    /* =====================================================
       CREATE ORDERS
    ===================================================== */

    const createdOrders = [];

    for (const farmerId in farmerMap) {

      let itemsTotal = 0;

      const orderItems = [];

      for (const item of farmerMap[farmerId]) {

        const product = item.product;

        /* STOCK CHECK + DEDUCT */

        const updated = await Product.findOneAndUpdate(
  {
    _id: product._id,
    quantity: { $gte: item.quantity }
  },
  {
    $inc: { quantity: -item.quantity }
  },
  {
    returnDocument: "after"
  }
);

if (!updated) {
  throw new Error(`${product.name} out of stock`);
}

/* UPDATE STOCK STATUS */

updated.isAvailable = updated.quantity > 0;

if (updated.quantity === 0) {

  updated.stockStatus = "out_of_stock";

} else if (updated.quantity < 10) {

  updated.stockStatus = "low_stock";

} else {

  updated.stockStatus = "in_stock";
}

await updated.save();

        const price = product.price;

        const totalPrice = price * item.quantity;

        itemsTotal += totalPrice;

        orderItems.push({
          product: product._id,
          name: product.name,
          quantity: item.quantity,
          pricePerUnit: price,
          totalPrice
        });
      }


      /* =====================================================
         BILLING CALCULATIONS
      ===================================================== */

      const deliveryCharge =
        itemsTotal >= 1000 ? 0 : 50;

      const gstAmount =
        Number((itemsTotal * 0.05).toFixed(2));

      const platformFee = 10;

      const discountAmount = 0;

      const grandTotal =
        itemsTotal +
        deliveryCharge +
        gstAmount +
        platformFee -
        discountAmount;


      /* =====================================================
         PAYMENT STATUS
      ===================================================== */

      let paymentStatus = "pending";

      if (paymentMethod === "online") {
        paymentStatus = "escrow";
      }


      /* =====================================================
         CREATE ORDER
      ===================================================== */

      const order = await Order.create({

        farmer: farmerId,

        restaurant: req.user.id,

        items: orderItems,

        billingDetails,

        deliveryAddress: address,

        pricing: {
          itemsTotal,
          deliveryCharge,
          gstAmount,
          platformFee,
          discountAmount,
          grandTotal
        },

        totalAmount: grandTotal,

        paymentMethod,

        paymentStatus,

        termsAccepted,

        timeline: [
          {
            status: "placed",
            timestamp: new Date()
          }
        ]
      });


      /* =====================================================
         CREATE PAYMENT RECORD
      ===================================================== */

      await Payment.create({

        order: order._id,

        user: req.user.id,

        amount: grandTotal,

        paymentMethod,

        status:
          paymentMethod === "cod"
            ? "pending"
            : "created",

        escrowStatus:
          paymentMethod === "online"
            ? "locked"
            : "released",

        billing: {
          itemsTotal,
          deliveryCharge,
          gstAmount,
          platformFee,
          discountAmount,
          grandTotal
        }
      });

      createdOrders.push(order);
    }


    /* =====================================================
       CLEAR CART
    ===================================================== */

    await Cart.findOneAndUpdate(
      { user: req.user.id },
      {
        items: [],
        cartTotal: 0
      }
    );


    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orders: createdOrders
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
  success: false,
  message: err.message
});
  }
};


/* =========================================================
   GET ALL ORDERS
========================================================= */

exports.getOrders = async (req, res) => {

  try {

    const orders = await Order.find({
      $or: [
        { farmer: req.user.id },
        { restaurant: req.user.id }
      ]
    })
    .populate("items.product")
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


/* =========================================================
   GET SINGLE ORDER
========================================================= */

exports.getSingleOrder = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("farmer", "name")
      .populate("restaurant", "name");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (
  order.farmer._id.toString() !== req.user.id &&
  order.restaurant._id.toString() !== req.user.id
) {
  return res.status(403).json({
    success: false,
    message: "Unauthorized"
  });
}

    res.json({
      success: true,
      order
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

exports.updateOrderStatus = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    /* SECURITY CHECK */

    if (order.farmer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const allowedStatuses = [
  "confirmed",
  "shipped",
  "delivered",
  "cancelled"
];

if (!allowedStatuses.includes(req.body.status)) {
  return res.status(400).json({
    success: false,
    message: "Invalid status"
  });
}

    order.updateStatus(req.body.status);

    await order.save();

    res.json({
      success: true,
      message: "Status updated",
      order
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


/* =========================================================
   CANCEL ORDER
========================================================= */

exports.cancelOrder = async (req, res) => {

  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      throw new Error("Order not found");
    }

    /* ONLY RESTAURANT CAN CANCEL */

    if (order.restaurant.toString() !== req.user.id) {
      throw new Error("Unauthorized");
    }

    /* CANNOT CANCEL AFTER SHIPPING */

    if (
      ["shipped", "delivered"]
      .includes(order.status)
    ) {
      throw new Error(
        "Order cannot be cancelled"
      );
    }

    /* RESTORE STOCK */

    for (const item of order.items) {

      const restored = await Product.findById(
  item.product
);

if (restored) {

  restored.quantity += item.quantity;

  restored.isAvailable =
    restored.quantity > 0;

  if (restored.quantity === 0) {

    restored.stockStatus = "out_of_stock";

  } else if (restored.quantity < 10) {

    restored.stockStatus = "low_stock";

  } else {

    restored.stockStatus = "in_stock";
  }

  await restored.save();
}
    }

    /* UPDATE ORDER */

    order.status = "cancelled";

    order.timeline.push({
      status: "cancelled",
      timestamp: new Date()
    });

    await order.save();

    /* UPDATE PAYMENT */

    await Payment.findOneAndUpdate(
      { order: order._id },
      {
        status: "refunded",
        escrowStatus: "refunded"
      }
    );

    res.json({
      success: true,
      message: "Order cancelled"
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};