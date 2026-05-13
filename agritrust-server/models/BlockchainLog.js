const mongoose = require("mongoose");

const blockchainLogSchema = new mongoose.Schema(
{
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },

  eventType: {
    type: String,
    enum: ["order_created", "payment_verified", "delivery_confirmed", "dispute"],
    required: true
  },

  transactionHash: {
    type: String,
    required: true
  },

  blockNumber: Number,

  network: {
    type: String,
    default: "private-ethereum"
  }

},
{
  timestamps: true
});

blockchainLogSchema.index({ order: 1 });

module.exports = mongoose.model("BlockchainLog", blockchainLogSchema);