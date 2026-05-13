const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema(
{
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },

  locations: [
    {
      lat: Number,
      lng: Number,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],

  currentStatus: {
    type: String,
    enum: ["picked", "in_transit", "delivered"],
    default: "picked"
  },

  eta: Date

},
{
  timestamps: true
});

trackingSchema.index({ order: 1 });

module.exports = mongoose.model("Tracking", trackingSchema);