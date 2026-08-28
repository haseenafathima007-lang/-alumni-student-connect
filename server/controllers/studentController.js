const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/response");

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private (Student only)
const getStudentProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let profile = await StudentProfile.findOne({ user: userId }).populate(
      "user",
      "name email avatar role"
    );

    if (!profile) {
      profile = await StudentProfile.create({ user: userId });
      profile = await profile.populate("user", "name email avatar role");
    }

    return sendSuccess(res, "Student profile retrieved", profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private (Student only)
const updateStudentProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let profile = await StudentProfile.findOne({ user: userId });

    if (!profile) {
      profile = new StudentProfile({ user: userId });
    }

    const {
      department,
      batch,
      rollNumber,
      cgpa,
      skills,
      careerInterests,
      bio,
      linkedIn,
      github,
      resumeUrl,
    } = req.body;

    if (department !== undefined) profile.department = department;
    if (batch !== undefined) profile.batch = batch;
    if (rollNumber !== undefined) profile.rollNumber = rollNumber;
    if (cgpa !== undefined) profile.cgpa = cgpa;
    if (skills !== undefined)
      profile.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim());
    if (careerInterests !== undefined)
      profile.careerInterests = Array.isArray(careerInterests)
        ? careerInterests
        : careerInterests.split(",").map((s) => s.trim());
    if (bio !== undefined) profile.bio = bio;
    if (linkedIn !== undefined) profile.linkedIn = linkedIn;
    if (github !== undefined) profile.github = github;
    if (resumeUrl !== undefined) profile.resumeUrl = resumeUrl;

    await profile.save();

    return sendSuccess(res, "Student profile updated successfully", profile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentProfile,
  updateStudentProfile,
};
