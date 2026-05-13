const router = require("express").Router();

const ctrl = require("../controllers/orderController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");


/* =========================================================
   CREATE ORDER
   ONLY RESTAURANT
========================================================= */

router.post(
  "/",
  protect,
  authorize("restaurant"),
  ctrl.createOrder
);


/* =========================================================
   GET ALL ORDERS
   FARMER + RESTAURANT
========================================================= */

router.get(
  "/",
  protect,
  authorize("restaurant", "farmer"),
  ctrl.getOrders
);


/* =========================================================
   GET SINGLE ORDER
========================================================= */

router.get(
  "/:id",
  protect,
  authorize("restaurant", "farmer"),
  ctrl.getSingleOrder
);


/* =========================================================
   UPDATE ORDER STATUS
   ONLY FARMER
========================================================= */

router.put(
  "/:id/status",
  protect,
  authorize("farmer"),
  ctrl.updateOrderStatus
);


/* =========================================================
   CANCEL ORDER
   ONLY RESTAURANT
========================================================= */

router.put(
  "/:id/cancel",
  protect,
  authorize("restaurant"),
  ctrl.cancelOrder
);

module.exports = router;