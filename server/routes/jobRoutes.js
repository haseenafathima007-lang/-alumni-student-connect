const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  createJob,
  applyForJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllJobs);
router.post("/", protect, createJob);
router.post("/:id/apply", protect, applyForJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;
