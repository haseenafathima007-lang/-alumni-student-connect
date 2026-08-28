const express = require("express");
const router = express.Router();
const {
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/my", protect, getMyApplications);
router.get("/", protect, getAllApplications);
router.put("/:id/status", protect, updateApplicationStatus);

module.exports = router;
