const express = require("express");
const router = express.Router();

const advisoryController = require("../controllers/advisoryController");

// Middleware
const { protect, authorize } = require("../middleware/authMiddleware");

// ================= CREATE ADVISORY =================
// Full advisory (ML + weather + market + planning)

router.post(
  "/",
  protect,
  authorize("farmer"),
  advisoryController.getAdvisory
);

// ================= QUICK ADVISORY =================
// Preview without saving (useful for UI)

router.post(
  "/quick",
  protect,
  authorize("farmer"),
  advisoryController.getQuickAdvisory
);

// ================= GET USER ADVISORIES =================

router.get(
  "/my",
  protect,
  authorize("farmer"),
  advisoryController.getMyAdvisories
);

// ================= GET SINGLE ADVISORY =================

router.get(
  "/:id",
  protect,
  authorize("farmer"),
  advisoryController.getAdvisoryById
);

// ================= ADD FEEDBACK =================

router.post(
  "/feedback",
  protect,
  authorize("farmer"),
  advisoryController.addFeedback
);

// ================= REFRESH ADVISORY =================
// Recalculate advisory using latest weather + market

router.post(
  "/:id/refresh",
  protect,
  authorize("farmer"),
  advisoryController.refreshAdvisory
);

module.exports = router;