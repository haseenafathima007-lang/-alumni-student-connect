const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  createEvent,
  registerForEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllEvents);
router.post("/", protect, createEvent);
router.post("/:id/register", protect, registerForEvent);
router.delete("/:id", protect, deleteEvent);

module.exports = router;
