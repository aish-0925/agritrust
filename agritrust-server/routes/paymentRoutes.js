const router = require("express").Router();
const ctrl = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/authMiddleware");

/* ================= CREATE PAYMENT ================= */
/* Only restaurant (buyer) */
router.post(
  "/:orderId",
  protect,
  authorize("restaurant"),
  ctrl.createPayment
);

/* ================= VERIFY PAYMENT ================= */
/* Only restaurant (who paid) */
router.post(
  "/verify",
  protect,
  authorize("restaurant"),
  ctrl.verifyPayment
);

module.exports = router;