const express = require("express");
const router = express.Router();
const {
  getAllAlumni,
  getAlumniById,
  updateAlumniProfile,
} = require("../controllers/alumniController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/", getAllAlumni);
router.get("/:id", getAlumniById);
router.put("/profile", protect, authorize("Alumni", "Admin"), updateAlumniProfile);

module.exports = router;
