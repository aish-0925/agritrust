// controllers/paymentController.js

const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Order = require("../models/Order");

const razorpay = new Razorpay({
  key_id: "YOUR_KEY",
  key_secret: "YOUR_SECRET"
});


/* CREATE PAYMENT ORDER */
exports.createPayment = async (req, res) => {
  const order = await Order.findById(req.params.orderId);

  const options = {
    amount: order.totalAmount * 100,
    currency: "INR"
  };

  const rzpOrder = await razorpay.orders.create(options);

  const payment = await Payment.create({
    order: order._id,
    user: req.user.id,
    amount: order.totalAmount,
    razorpayOrderId: rzpOrder.id
  });

  res.json(payment);
};


/* VERIFY PAYMENT */
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expected = crypto
    .createHmac("sha256", "YOUR_SECRET")
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment" });
  }

  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

  payment.status = "paid";
  payment.escrowStatus = "locked";

  await payment.save();

  const order = await Order.findById(payment.order);
  order.status = "paid";
  order.paymentStatus = "escrow";

  await order.save();

  res.json({ message: "Payment verified" });
};