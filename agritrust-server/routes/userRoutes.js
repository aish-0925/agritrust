const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const multerErrorHandler = require("../middleware/multerErrorHandler");

const {
  getProfile,
  updateProfile
} = require("../controllers/userController");

/* ================= GET PROFILE ================= */
router.get("/profile", protect, getProfile);

/* ================= UPDATE PROFILE ================= */
router.put(
  "/profile",
  protect,
  upload.single("profileImage"),   // image upload
  multerErrorHandler,              // multer error handling
  updateProfile
);

module.exports = router;