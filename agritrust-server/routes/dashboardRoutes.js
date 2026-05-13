const router = require("express").Router();
const ctrl = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/authMiddleware");

/* Common */
router.get("/", protect, ctrl.getDashboard);

/* Farmer */
router.get(
  "/farmer-stats",
  protect,
  authorize("farmer"),
  ctrl.getFarmerStats
);

/* Restaurant */
router.get(
  "/restaurant-stats",
  protect,
  authorize("restaurant"),
  ctrl.getRestaurantStats
);

module.exports = router;