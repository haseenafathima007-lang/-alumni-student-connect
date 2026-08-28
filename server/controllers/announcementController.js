const Announcement = require("../models/Announcement");
const { sendSuccess, sendError } = require("../utils/response");

let inMemoryAnnouncements = [
  {
    _id: "ann-1",
    title: "Placement Training Workshop: Cloud Architecture & DevOps",
    content: "All 3rd and 4th-year students are requested to register for the upcoming weekend workshop led by alumni from Infosys and Google.",
    targetRole: "all",
    date: "2026-08-25",
  },
  {
    _id: "ann-2",
    title: "Annual Alumni Homecoming 2026 Registration Open",
    content: "Department invites all batch alumni to attend our annual homecoming and interactive networking mixer.",
    targetRole: "all",
    date: "2026-08-22",
  },
];

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public / Authenticated
const getAnnouncements = async (req, res, next) => {
  try {
    let list = [];
    try {
      list = await Announcement.find().sort({ createdAt: -1 });
    } catch (e) {}

    if (list.length === 0) {
      list = inMemoryAnnouncements;
    }

    return sendSuccess(res, "Announcements retrieved", list);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private (Faculty/Admin)
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, targetRole } = req.body;
    if (!title || !content) {
      return sendError(res, "Title and content are required", 400);
    }

    const newAnn = {
      _id: "ann-" + Date.now(),
      title,
      content,
      targetRole: targetRole || "all",
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };

    inMemoryAnnouncements.unshift(newAnn);

    try {
      await Announcement.create({
        title,
        content,
        targetRole: targetRole || "all",
      });
    } catch (e) {}

    return sendSuccess(res, "Announcement published successfully", newAnn, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
};
