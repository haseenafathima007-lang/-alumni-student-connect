const express = require("express");
const router = express.Router();
const {
  getStudentProfile,
  updateStudentProfile,
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/profile", protect, authorize("Student", "Admin"), getStudentProfile);
router.put("/profile", protect, authorize("Student", "Admin"), updateStudentProfile);

module.exports = router;
