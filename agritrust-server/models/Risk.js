const mongoose = require("mongoose");

const riskSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  riskScore: {
    type: Number,
    default: 0
  },

  disputeCount: {
    type: Number,
    default: 0
  },

  flagged: {
    type: Boolean,
    default: false
  }

},
{
  timestamps: true
});

module.exports = mongoose.model("Risk", riskSchema);