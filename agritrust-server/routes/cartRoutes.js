const router = require("express").Router();

const ctrl = require("../controllers/cartController");
const { protect, authorize } = require("../middleware/authMiddleware");

/* ================= CART ================= */

/* ADD TO CART */
router.post("/", protect, authorize("restaurant"), ctrl.addToCart);

/* GET CART */
router.get("/", protect, authorize("restaurant"), ctrl.getCart);

/* UPDATE ITEM QUANTITY */
router.put("/:productId", protect, authorize("restaurant"), ctrl.updateCartItem);

/* REMOVE ITEM */
router.delete("/:productId", protect, authorize("restaurant"), ctrl.removeCartItem);

/* CLEAR CART */
router.delete("/", protect, authorize("restaurant"), ctrl.clearCart);

module.exports = router;