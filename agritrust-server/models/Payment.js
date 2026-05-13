const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
{
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: "INR"
  },

  /* Razorpay */
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,

  /* STATUS */
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "created"
  },

  /* ESCROW */
  escrowStatus: {
    type: String,
    enum: ["locked", "released", "refunded"],
    default: "locked"
  }

},
{
  timestamps: true
});

paymentSchema.index({ order: 1 });

module.exports = mongoose.model("Payment", paymentSchema);