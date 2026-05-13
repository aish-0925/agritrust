// controllers/disputeController.js

const Dispute = require("../models/Dispute");
const Order = require("../models/Order");

exports.createDispute = async (req, res) => {
  const dispute = await Dispute.create({
    order: req.params.orderId,
    raisedBy: req.user.id,
    reason: req.body.reason,
    description: req.body.description
  });

  await Order.findByIdAndUpdate(req.params.orderId, {
    dispute: dispute._id
  });

  res.json(dispute);
};