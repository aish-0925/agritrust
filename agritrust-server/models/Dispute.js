const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema(
{
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },

  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  reason: {
    type: String,
    required: true
  },

  description: String,

  evidence: [String], // images/docs

  status: {
    type: String,
    enum: ["open", "under_review", "resolved", "rejected"],
    default: "open"
  },

  resolution: String

},
{
  timestamps: true
});

module.exports = mongoose.model("Dispute", disputeSchema);