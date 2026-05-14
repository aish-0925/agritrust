const mongoose = require("mongoose");

/* =========================================================
   ORDER ITEM
========================================================= */

const orderItemSchema = new mongoose.Schema({

  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  pricePerUnit: {
    type: Number,
    required: true
  },

  totalPrice: {
    type: Number,
    default: 0
  }

});


/* =========================================================
   MAIN ORDER
========================================================= */

const orderSchema = new mongoose.Schema(
{
  /* ================= ORDER ID ================= */

  orderId: {
    type: String,
    unique: true
  },

  /* ================= USERS ================= */

  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  /* ================= ITEMS ================= */

  items: [orderItemSchema],

  /* ================= BILLING DETAILS ================= */

  billingDetails: {

    name: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    email: {
      type: String
    },

    address: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    state: {
      type: String,
      required: true
    },

    pincode: {
      type: String,
      required: true
    }

  },

  /* ================= DELIVERY ADDRESS ================= */

  deliveryAddress: {

    name: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    state: {
      type: String,
      required: true
    },

    pincode: {
      type: String,
      required: true
    },

    coordinates: {

      lat: Number,

      lng: Number
    }

  },

  /* ================= PRICING ================= */

  pricing: {

    itemsTotal: {
      type: Number,
      default: 0
    },

    deliveryCharge: {
      type: Number,
      default: 0
    },

    gstAmount: {
      type: Number,
      default: 0
    },

    platformFee: {
      type: Number,
      default: 0
    },

    discountAmount: {
      type: Number,
      default: 0
    },

    grandTotal: {
      type: Number,
      default: 0
    }

  },

  totalAmount: {
    type: Number,
    default: 0
  },

  /* ================= ORDER STATUS ================= */

  status: {
    type: String,
    enum: [
      "placed",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled"
    ],
    default: "placed"
  },

  /* ================= PAYMENT ================= */

  paymentMethod: {
    type: String,
    enum: ["cod", "online"],
    default: "cod"
  },

  paymentStatus: {
    type: String,
    enum: [
      "pending",
      "escrow",
      "paid",
      "failed",
      "refunded"
    ],
    default: "pending"
  },

  termsAccepted: {
    type: Boolean,
    required: true
  },

  /* ================= DELIVERY DATES ================= */

  estimatedDelivery: Date,

  deliveredAt: Date,

  /* ================= TIMELINE ================= */

  timeline: [
    {
      status: String,
      timestamp: Date
    }
  ]

},
{
  timestamps: true
});


/* =========================================================
   AUTO LOGIC
========================================================= */

orderSchema.pre("save", function () {

  /* ================= GENERATE ORDER ID ================= */

  if (!this.orderId) {

    const rand = Math.floor(
      1000 + Math.random() * 9000
    );

    this.orderId =
      `ORD-${Date.now()}-${rand}`;
  }

  /* ================= ITEM TOTALS ================= */

  if (this.items.length > 0) {

    this.items.forEach(item => {

      item.totalPrice =
        item.quantity *
        item.pricePerUnit;
    });

    this.pricing.itemsTotal =
      this.items.reduce(
        (sum, item) =>
          sum + item.totalPrice,
        0
      );
  }

  /* ================= GRAND TOTAL ================= */

  this.pricing.grandTotal =
    this.pricing.itemsTotal +
    this.pricing.deliveryCharge +
    this.pricing.gstAmount +
    this.pricing.platformFee -
    this.pricing.discountAmount;

  this.totalAmount =
    this.pricing.grandTotal;
});


/* =========================================================
   STATUS UPDATE METHOD
========================================================= */

orderSchema.methods.updateStatus = function (newStatus) {

  this.status = newStatus;

  this.timeline.push({
    status: newStatus,
    timestamp: new Date()
  });

  /* ================= DELIVERY COMPLETED ================= */

  if (newStatus === "delivered") {

    this.deliveredAt = new Date();

    /* COD becomes paid after delivery */

    if (this.paymentMethod === "cod") {

      this.paymentStatus = "paid";
    }
  }
};

module.exports = mongoose.model("Order", orderSchema);