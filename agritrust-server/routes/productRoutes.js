const router = require("express").Router();

const ctrl = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");
const multerErrorHandler = require("../middleware/multerErrorHandler");

/*  BROWSE PRODUCTS (PUBLIC) */
router.get("/browse", protect, authorize("restaurant"), ctrl.browseProducts);

/* CREATE PRODUCT */
router.post(
  "/",
  protect,
  authorize("farmer"),
  upload.array("images", 5),
  multerErrorHandler,
  ctrl.createProduct
);

/* GET MY PRODUCTS */
router.get(
  "/",
  protect,
  authorize("farmer"),
  ctrl.getProducts
);

/* GET SINGLE PRODUCT (ONLY OWN) */
router.get(
  "/:id",
  protect,
  authorize("farmer"),
  ctrl.getProductById
);

/* UPDATE PRODUCT */
router.put(
  "/:id",
  protect,
  authorize("farmer"),
  upload.array("images", 5),
  multerErrorHandler,
  ctrl.updateProduct
);

/* DELETE PRODUCT */
router.delete(
  "/:id",
  protect,
  authorize("farmer"),
  ctrl.deleteProduct
);

module.exports = router;