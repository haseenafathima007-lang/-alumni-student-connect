const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getPendingVerifications,
  verifyAlumnus,
  getPlatformStats,
} = require("../controllers/adminController");

router.get("/stats", getDashboardStats);
router.get("/verifications", getPendingVerifications);
router.put("/verify/:id", verifyAlumnus);
router.get("/platform-stats", getPlatformStats);

module.exports = router;
