const Mentorship = require("../models/Mentorship");
const Notification = require("../models/Notification");
const AlumniProfile = require("../models/AlumniProfile");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/response");

// @desc    Request a mentorship session
// @route   POST /api/mentorship/request
// @access  Private (Student)
const requestMentorship = async (req, res, next) => {
  try {
    const { mentorId, topic, message } = req.body;

    if (!mentorId || !topic || !message) {
      return sendError(res, "Please provide mentorId, topic and message", 400);
    }

    let actualMentorUserId = mentorId;
    try {
      const alumniProfile = await AlumniProfile.findById(mentorId);
      if (alumniProfile && alumniProfile.user) {
        actualMentorUserId = alumniProfile.user;
      }
    } catch (e) {
      // mentorId was already a User ID
    }

    // Verify mentor's faculty approval status
    const mentorUser = await User.findById(actualMentorUserId);
    if (mentorUser && mentorUser.role === "Alumni") {
      if (mentorUser.verificationStatus !== "approved" || !mentorUser.isVerified) {
        return sendError(
          res,
          "Mentorship requests can only be sent to faculty-approved mentors.",
          403
        );
      }
    }

    const request = await Mentorship.create({
      student: req.user._id,
      mentor: actualMentorUserId,
      topic,
      message,
    });

    // Send notification to mentor
    try {
      await Notification.create({
        recipient: actualMentorUserId,
        sender: req.user._id,
        title: "New Mentorship Request",
        message: `${req.user.name || "A student"} requested mentorship on "${topic}"`,
        type: "mentorship",
        link: "/alumni/mentorship-requests",
      });
    } catch (notifErr) {
      console.warn("Mentorship notification warning:", notifErr.message);
    }

    return sendSuccess(res, "Mentorship request sent successfully!", request, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's mentorship requests
// @route   GET /api/mentorship/my-requests
// @access  Private
const getMyMentorshipRequests = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const requests = await Mentorship.find({
      $or: [{ student: userId }, { mentor: userId }],
    })
      .populate("student", "name email avatar")
      .populate("mentor", "name email avatar")
      .sort({ createdAt: -1 });

    return sendSuccess(res, "Mentorship requests retrieved", requests);
  } catch (error) {
    next(error);
  }
};

// @desc    Update mentorship request status (accept/reject)
// @route   PUT /api/mentorship/:id/status
// @access  Private (Alumni/Mentor)
const updateMentorshipStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, responseMessage, meetingLink } = req.body;

    if (!["accepted", "rejected", "completed"].includes(status)) {
      return sendError(res, "Invalid status", 400);
    }

    const request = await Mentorship.findById(id);
    if (!request) {
      return sendError(res, "Mentorship request not found", 404);
    }

    request.status = status;
    if (responseMessage) request.responseMessage = responseMessage;
    if (meetingLink) request.meetingLink = meetingLink;

    await request.save();

    // Notify student
    try {
      const recipientId = request.student?._id || request.student;
      if (recipientId) {
        await Notification.create({
          recipient: recipientId,
          sender: req.user._id,
          title: `Mentorship Request ${status.toUpperCase()}`,
          message: `Your mentorship request has been ${status}. ${responseMessage || ""}`,
          type: "mentorship",
          link: "/student/mentorship-requests",
        });
      }
    } catch (notifErr) {
      console.warn("Mentorship update notification warning:", notifErr.message);
    }

    return sendSuccess(res, `Mentorship status updated to ${status}`, request);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestMentorship,
  getMyMentorshipRequests,
  updateMentorshipStatus,
};
