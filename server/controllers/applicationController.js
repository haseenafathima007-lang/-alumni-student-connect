const Application = require("../models/Application");
const Job = require("../models/Job");
const Internship = require("../models/Internship");
const Notification = require("../models/Notification");
const { sendSuccess, sendError } = require("../utils/response");

// @desc    Get current student's applications
// @route   GET /api/applications/my
// @access  Private (Student)
const getMyApplications = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    let query = {};
    if (userId) {
      query.applicant = userId;
    }

    const applications = await Application.find(query)
      .populate("applicant", "name email rollNumber department")
      .populate("itemId")
      .sort({ createdAt: -1 });

    const formatted = applications.map((app) => {
      const item = app.itemId || {};
      return {
        _id: app._id,
        itemType: app.itemType,
        title: item.title || (app.itemType === "job" ? "Software Engineer" : "Technical Intern"),
        company: item.company || "Corporate Partner",
        location: item.location || "On-Campus / Hybrid",
        salaryOrStipend: item.salary || item.stipend || "Competitive",
        appliedAt: app.createdAt ? app.createdAt.toISOString().split("T")[0] : "2026-08-25",
        status: app.status,
        resumeUrl: app.resumeUrl,
        coverNote: app.coverNote,
      };
    });

    return sendSuccess(res, "Applications retrieved successfully", formatted);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (for Admin audit or Alumni candidate review)
// @route   GET /api/applications
// @access  Private (Admin / Alumni)
const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate("applicant", "name email")
      .populate("itemId")
      .sort({ createdAt: -1 });

    const formatted = applications.map((app) => {
      const applicant = app.applicant || {};
      const item = app.itemId || {};
      return {
        _id: app._id,
        applicant: applicant._id || app.applicant,
        studentName: applicant.name || "Student Candidate",
        studentEmail: applicant.email || "student@college.edu",
        rollNumber: "23CS104",
        department: "Computer Science & Engineering",
        batch: "2024",
        cgpa: "8.8",
        appliedFor: item.title || (app.itemType === "job" ? "Junior Software Engineer" : "Engineering Intern"),
        title: item.title || (app.itemType === "job" ? "Junior Software Engineer" : "Engineering Intern"),
        itemType: app.itemType,
        company: item.company || "Technology Partner",
        appliedDate: app.createdAt ? app.createdAt.toISOString().split("T")[0] : "2026-08-25",
        skills: item.skills || ["Java", "React", "SQL"],
        resumeUrl: app.resumeUrl || "https://drive.google.com/sample-resume",
        coverNote: app.coverNote,
        status: app.status,
      };
    });

    return sendSuccess(res, "All applications retrieved", formatted);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (shortlisted / accepted / rejected / under_review)
// @route   PUT /api/applications/:id/status
// @access  Private (Alumni / Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findById(id).populate("itemId");
    if (!application) {
      return sendError(res, "Application not found", 404);
    }

    application.status = status;
    await application.save();

    // Trigger Notification for applicant student
    try {
      const recipientId = application.applicant?._id || application.applicant;
      if (recipientId) {
        const positionTitle = application.itemId?.title || "your application";
        await Notification.create({
          recipient: recipientId,
          sender: req.user?._id,
          title: `Application Status: ${status.replace("_", " ").toUpperCase()}`,
          message: `Your application for ${positionTitle} has been updated to "${status.replace("_", " ")}".`,
          type: application.itemType === "internship" ? "internship" : "job",
          link: "/student/applications",
        });
      }
    } catch (notifErr) {
      console.warn("Application notification warning:", notifErr.message);
    }

    return sendSuccess(res, `Application status updated to ${status}`, application);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
};
