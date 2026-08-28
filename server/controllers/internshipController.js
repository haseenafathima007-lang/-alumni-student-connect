const Internship = require("../models/Internship");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const { sendSuccess, sendError } = require("../utils/response");

// @desc    Get all internships
// @route   GET /api/internships
// @access  Public
const getAllInternships = async (req, res, next) => {
  try {
    const { search, type } = req.query;
    let query = {};
    if (type && type !== "all") query.internshipType = type;

    let internships = await Internship.find(query)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    if (search) {
      const term = search.toLowerCase();
      internships = internships.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.company.toLowerCase().includes(term) ||
          (item.skills && item.skills.some((s) => s.toLowerCase().includes(term)))
      );
    }

    return sendSuccess(res, "Internships fetched successfully", internships);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new internship
// @route   POST /api/internships
// @access  Private (Alumni, Faculty, Admin)
const createInternship = async (req, res, next) => {
  try {
    const {
      title,
      company,
      location,
      duration,
      stipend,
      internshipType,
      description,
      requirements,
      skills,
      applicationLink,
      deadline,
    } = req.body;

    if (!title || !company || !description) {
      return sendError(res, "Please provide title, company and description", 400);
    }

    // Role verification check for Alumni
    if (req.user.role === "Alumni") {
      if (req.user.verificationStatus === "rejected") {
        return sendError(
          res,
          "Your alumni account has been rejected. Please contact the college administration.",
          403
        );
      }
      if (req.user.verificationStatus !== "approved" || !req.user.isVerified) {
        return sendError(
          res,
          "Your alumni account is pending faculty approval.",
          403
        );
      }
    }

    const internship = await Internship.create({
      title,
      company,
      location: location || "Remote",
      duration: duration || "3 Months",
      stipend: stipend || "Unpaid",
      internshipType: internshipType || "Virtual",
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : requirements
        ? requirements.split("\n").filter(Boolean)
        : [],
      skills: Array.isArray(skills)
        ? skills
        : skills
        ? skills.split(",").map((s) => s.trim())
        : [],
      postedBy: req.user?._id,
      applicationLink: applicationLink || "",
      deadline,
    });

    return sendSuccess(res, "Internship posted successfully", internship, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for an internship
// @route   POST /api/internships/:id/apply
// @access  Private (Student)
const applyForInternship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resumeUrl, coverNote } = req.body;

    const internship = await Internship.findById(id);
    if (!internship) {
      return sendError(res, "Internship not found", 404);
    }

    // Prevent duplicate application
    const existing = await Application.findOne({
      applicant: req.user._id,
      itemId: id,
    });

    if (existing) {
      return sendError(res, "You have already applied for this internship", 400);
    }

    internship.applicantsCount = (internship.applicantsCount || 0) + 1;
    await internship.save();

    const application = await Application.create({
      applicant: req.user._id,
      itemType: "internship",
      itemId: id,
      itemModel: "Internship",
      resumeUrl: resumeUrl || "",
      coverNote: coverNote || "",
      status: "applied",
    });

    // Notify internship poster
    if (internship.postedBy) {
      await Notification.create({
        recipient: internship.postedBy,
        sender: req.user._id,
        title: `New Applicant for ${internship.title}`,
        message: `${req.user.name || "A student"} submitted an internship application for ${internship.title}.`,
        type: "internship",
        link: "/alumni/applicants",
      });
    }

    return sendSuccess(res, "Internship application submitted successfully!", application, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private (Alumni owner or Admin)
const deleteInternship = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Internship.findByIdAndDelete(id);
    return sendSuccess(res, "Internship removed successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllInternships,
  createInternship,
  applyForInternship,
  deleteInternship,
};
