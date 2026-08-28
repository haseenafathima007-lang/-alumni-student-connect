const express = require("express");
const router = express.Router();
const {
  getAllInternships,
  createInternship,
  applyForInternship,
  deleteInternship,
} = require("../controllers/internshipController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllInternships);
router.post("/", protect, createInternship);
router.post("/:id/apply", protect, applyForInternship);
router.delete("/:id", protect, deleteInternship);

module.exports = router;
