const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

/* Basic Account Info */

name: {
  type: String,
  required: true,
  trim: true
},

email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true
},

password: {
  type: String,
  required: true
},

role: {
  type: String,
  enum: ["farmer", "restaurant", "admin"],
  required: true
},

/* Profile Status */

profileCompleted: {
  type: Boolean,
  default: false
},

/* Common Profile Fields */

phone: String,
address: String,
city: String,
state: String,
pincode: String,

profileImage: {
  type: String,
  default: ""
},

location: {
  lat: Number,
  lng: Number
},

/* ================= FARMER ================= */

farmName: {
  type: String,
  default: ""
},

farmLocation: String,

farmSize: String,

cropTypes: {
  type: [String],
  default: []
},

organicCertified: {
  type: Boolean,
  default: false
},

farmingExperience: Number,

farmerPayment: {
  upiId: String,
  bankAccount: {
    accountNumber: String,
    ifsc: String
  },
  name: String
},

/* ================= RESTAURANT ================= */

restaurantName: {
  type: String,
  default: ""
},

businessAddress: String,


cuisineTypes: {
  type: [String],   
  default: []
},

preferredIngredients: {
  type: [String],   
  default: []
},

dailyDemand: [
  {
    item: String,
    quantity: Number,
    unit: {
      type: String,
      default: "kg"
    }
  }
],

pricePreference: {
  type: String,
  enum: ["low", "medium", "premium"]
},

deliveryType: {
  type: String,
  enum: ["pickup", "delivery", "both"]
},

/* System */

createdAt: {
  type: Date,
  default: Date.now
}

});

module.exports = mongoose.model("User", userSchema);