const Event = require("../models/Event");
const Notification = require("../models/Notification");
const { sendSuccess, sendError } = require("../utils/response");

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res, next) => {
  try {
    const { category, mode } = req.query;
    let query = {};
    if (category && category !== "all") query.category = category;
    if (mode && mode !== "all") query.mode = mode;

    const events = await Event.find(query)
      .populate("organizer", "name email")
      .sort({ date: 1 });

    return sendSuccess(res, "Events fetched successfully", events);
  } catch (error) {
    next(error);
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private (Alumni, Faculty, Admin)
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      mode,
      meetingLink,
      category,
      speaker,
      speakerRole,
    } = req.body;

    if (!title || !description || !date || !time) {
      return sendError(res, "Please provide title, description, date and time", 400);
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location: location || "Online",
      mode: mode || "online",
      meetingLink: meetingLink || "",
      category: category || "Workshop",
      speaker: speaker || "",
      speakerRole: speakerRole || "",
      organizer: req.user?._id,
    });

    return sendSuccess(res, "Event created successfully", event, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return sendError(res, "Event not found", 404);
    }

    if (!event.attendees.includes(req.user._id)) {
      event.attendees.push(req.user._id);
      await event.save();

      // Trigger notification for user
      await Notification.create({
        recipient: req.user._id,
        title: `Registered: ${event.title}`,
        message: `You are confirmed for ${event.title} on ${event.date}. ${event.mode === "online" ? "Meeting link: " + (event.meetingLink || "TBA") : "Venue: " + event.location}`,
        type: "event",
        link: "/events",
      });
    }

    return sendSuccess(res, "Successfully registered for event!", event);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Faculty, Admin)
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    return sendSuccess(res, "Event removed successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEvents,
  createEvent,
  registerForEvent,
  deleteEvent,
};
