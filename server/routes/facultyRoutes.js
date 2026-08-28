const express = require("express");
const router = express.Router();
const {
  getStudents,
  getPendingAlumni,
  approveAlumni,
  rejectAlumni,
  getFacultyStats,
  recommendMentor,
  getFacultyProfile,
  updateFacultyProfile,
} = require("../controllers/facultyController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// All faculty routes require authentication and Faculty or Admin role
router.use(protect);
router.use(authorize("Faculty", "Admin"));

router.get("/stats", getFacultyStats);
router.get("/students", getStudents);
router.get("/alumni/pending", getPendingAlumni);
router.put("/alumni/:id/approve", approveAlumni);
router.put("/alumni/:id/reject", rejectAlumni);
router.post("/recommend-mentor", recommendMentor);
router.get("/profile", getFacultyProfile);
router.put("/profile", updateFacultyProfile);

module.exports = router;
