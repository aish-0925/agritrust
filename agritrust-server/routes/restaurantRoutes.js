const router = require("express").Router();
const ctrl = require("../controllers/restaurantController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/stats", protect, authorize("restaurant"), ctrl.getRestaurantStats);

router.get("/marketplace", protect, authorize("restaurant"), ctrl.getMarketplaceProducts);

router.get("/orders", protect, authorize("restaurant"), ctrl.getMyOrders);

router.post("/order", protect, authorize("restaurant"), ctrl.placeOrder);

module.exports = router;