const Job = require("../models/Job");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const { sendSuccess, sendError } = require("../utils/response");

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res, next) => {
  try {
    const { search, type } = req.query;
    let query = {};
    if (type && type !== "all") query.jobType = type;

    let jobs = await Job.find(query)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    if (search) {
      const term = search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(term) ||
          j.company.toLowerCase().includes(term) ||
          (j.skills && j.skills.some((s) => s.toLowerCase().includes(term)))
      );
    }

    return sendSuccess(res, "Jobs fetched successfully", jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Alumni, Faculty, Admin)
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      experienceLevel,
      salary,
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

    const job = await Job.create({
      title,
      company,
      location: location || "Remote",
      jobType: jobType || "Full-time",
      experienceLevel: experienceLevel || "Entry Level",
      salary: salary || "Not Disclosed",
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

    return sendSuccess(res, "Job posted successfully", job, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Student)
const applyForJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resumeUrl, coverNote } = req.body;

    const job = await Job.findById(id);
    if (!job) {
      return sendError(res, "Job opening not found", 404);
    }

    // Check duplicate application
    const existing = await Application.findOne({
      applicant: req.user._id,
      itemId: id,
    });

    if (existing) {
      return sendError(res, "You have already applied for this job", 400);
    }

    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    const application = await Application.create({
      applicant: req.user._id,
      itemType: "job",
      itemId: id,
      itemModel: "Job",
      resumeUrl: resumeUrl || "",
      coverNote: coverNote || "",
      status: "applied",
    });

    // Send notification to job poster
    if (job.postedBy) {
      await Notification.create({
        recipient: job.postedBy,
        sender: req.user._id,
        title: `New Application for ${job.title}`,
        message: `${req.user.name || "A student"} applied for ${job.title} at ${job.company}.`,
        type: "job",
        link: "/alumni/applicants",
      });
    }

    return sendSuccess(res, "Application submitted successfully!", application, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Alumni owner or Admin)
const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    return sendSuccess(res, "Job posting removed successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllJobs,
  createJob,
  applyForJob,
  deleteJob,
};
