// controllers/trackingController.js

const Tracking = require("../models/Tracking");

/* UPDATE LOCATION */
exports.updateLocation = async (req, res) => {
  const { lat, lng } = req.body;

  const tracking = await Tracking.findOneAndUpdate(
    { order: req.params.orderId },
    {
      $push: {
        locations: { lat, lng }
      }
    },
    { new: true, upsert: true }
  );

  res.json(tracking);
};