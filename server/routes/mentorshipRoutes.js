const express = require("express");
const router = express.Router();
const {
  requestMentorship,
  getMyMentorshipRequests,
  updateMentorshipStatus,
} = require("../controllers/mentorshipController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.post("/request", protect, authorize("Student"), requestMentorship);
router.get("/my-requests", protect, getMyMentorshipRequests);
router.put("/:id/status", protect, authorize("Alumni", "Faculty", "Admin"), updateMentorshipStatus);

module.exports = router;
