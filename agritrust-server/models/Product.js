const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
  /* Readable Product ID */
  productId: {
    type: String,
    unique: true
  },

  /* BASIC INFO */
  name: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    enum: ["vegetable", "fruit", "grain", "spice", "other"],
    default: "vegetable"
  },

  description: String,

  /* FARMER */
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  farmName: String,

  farmLocation: {
    city: String,
    state: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  /* PRICING */
  price: {
    type: Number,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  unit: {
    type: String,
    default: "kg"
  },

  minOrderQty: {
    type: Number,
    default: 1
  },

  /* QUALITY */
  qualityGrade: {
    type: String,
    enum: ["A", "B", "C"],
    default: "A"
  },

  organic: {
    type: Boolean,
    default: false
  },

  /* TRUST + AI */
  trustScore: {
    type: Number,
    default: 100
  },

  demandLevel: {
    type: String,
    enum: ["high", "moderate", "low"],
    default: "moderate"
  },

  /* BLOCKCHAIN */
  blockchainHash: {
    type: String,
    default: null
  },

  /* MEDIA */
  images: [String],

  /* STATUS */
  isAvailable: {
    type: Boolean,
    default: true
  },

  stockStatus: {
  type: String,
  enum: ["in_stock", "low_stock", "out_of_stock"],
  default: "in_stock"
},

rating: {
  type: Number,
  default: 0
},

reviewsCount: {
  type: Number,
  default: 0
},

deliveryAvailable: {
  type: Boolean,
  default: true
},

coordinates: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: {
    type: [Number], // [lng, lat]
    index: "2dsphere"
  }
}

},
{
  timestamps: true
});


/* ───────── AUTO LOGIC ───────── */

productSchema.pre("save", async function () {

  // Product ID
  if (!this.productId) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.productId = `PROD-${Date.now()}-${rand}`;
  }

  // Availability
  this.isAvailable = this.quantity > 0;

  if (this.quantity === 0) {
  this.stockStatus = "out_of_stock";
} else if (this.quantity < 10) {
  this.stockStatus = "low_stock";
} else {
  this.stockStatus = "in_stock";
}

  // Fake blockchain hash
  if (!this.blockchainHash) {
    this.blockchainHash = "0x" + Math.random().toString(16).substring(2, 12);
  }

});


/* ───────── INDEXING ───────── */

productSchema.index({ farmer: 1 });
productSchema.index({ category: 1 });
productSchema.index({ demandLevel: 1 });
productSchema.index({ price: 1 });

productSchema.methods.updateStockStatus = function () {

  this.isAvailable = this.quantity > 0;

  if (this.quantity === 0) {

    this.stockStatus = "out_of_stock";

  } else if (this.quantity < 10) {

    this.stockStatus = "low_stock";

  } else {

    this.stockStatus = "in_stock";
  }
};

module.exports = mongoose.model("Product", productSchema);