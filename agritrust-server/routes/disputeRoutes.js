const router = require("express").Router();
const ctrl = require("../controllers/disputeController");
const { protect } = require("../middleware/authMiddleware");

router.post("/:orderId", protect, ctrl.createDispute);

module.exports = router;