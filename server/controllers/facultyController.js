const User = require("../models/User");
const FacultyProfile = require("../models/FacultyProfile");
const StudentProfile = require("../models/StudentProfile");
const AlumniProfile = require("../models/AlumniProfile");
const Notification = require("../models/Notification");
const Event = require("../models/Event");
const Announcement = require("../models/Announcement");
const { sendSuccess, sendError } = require("../utils/response");

let facultyRecommendations = [];

// @desc    Get department students
// @route   GET /api/faculty/students
// @access  Private (Faculty/Admin)
const getStudents = async (req, res, next) => {
  try {
    const studentProfiles = await StudentProfile.find().populate("user", "name email avatar");
    const students = studentProfiles.map((sp) => {
      const u = sp.user || {};
      return {
        _id: sp._id,
        name: u.name || "Student Candidate",
        email: u.email || "student@college.edu",
        rollNumber: sp.rollNumber || "23CS104",
        department: sp.department || "Computer Science and Engineering",
        batch: sp.batch || "2023-2027",
        cgpa: sp.cgpa || "8.8",
        skills: sp.skills || ["Java", "React", "SQL"],
        placementStatus: "Preparing",
      };
    });

    return sendSuccess(res, "Students retrieved successfully", students);
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending alumni verification list for Faculty
// @route   GET /api/faculty/alumni/pending
// @access  Private (Faculty/Admin)
const getPendingAlumni = async (req, res, next) => {
  try {
    // Retrieve alumni with pending status or isVerified false
    const pendingUsers = await User.find({
      role: "Alumni",
      $or: [{ verificationStatus: "pending" }, { isVerified: false, verificationStatus: { $ne: "rejected" } }],
    }).sort({ createdAt: -1 });

    const alumniProfiles = await AlumniProfile.find({
      user: { $in: pendingUsers.map((u) => u._id) },
    });

    const pendingAlumni = pendingUsers.map((u) => {
      const p = alumniProfiles.find((ap) => ap.user && ap.user.toString() === u._id.toString()) || {};
      return {
        _id: u._id,
        userId: u._id,
        name: u.name,
        email: u.email,
        avatar: u.avatar,
        department: p.department || "Artificial Intelligence and Data Science",
        graduationYear: p.graduationYear || "2023",
        company: p.company || "Pending Update",
        jobTitle: p.jobTitle || "Alumni Member",
        industry: p.industry || "Information Technology",
        location: p.location || "Chennai, India",
        expertise: p.expertise || [],
        bio: p.bio || "Registered alumni awaiting faculty verification.",
        verificationStatus: u.verificationStatus || "pending",
        isVerified: u.isVerified || false,
        createdAt: u.createdAt,
      };
    });

    return sendSuccess(res, "Pending alumni retrieved successfully", pendingAlumni);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve alumni verification
// @route   PUT /api/faculty/alumni/:id/approve
// @access  Private (Faculty/Admin)
const approveAlumni = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, "Alumni user not found", 404);
    }

    if (user.role !== "Alumni") {
      return sendError(res, "Only alumni accounts can be verified or approved", 400);
    }

    const now = new Date();
    user.verificationStatus = "approved";
    user.isVerified = true;
    user.verifiedBy = req.user?._id || null;
    user.verifiedAt = now;
    user.rejectionReason = "";
    await user.save();

    // Update corresponding AlumniProfile
    await AlumniProfile.findOneAndUpdate(
      { user: id },
      {
        verificationStatus: "approved",
        verifiedBy: req.user?._id || null,
        verifiedAt: now,
        rejectionReason: "",
      },
      { new: true }
    );

    // Send notification to the approved alumni
    try {
      await Notification.create({
        recipient: user._id,
        sender: req.user?._id,
        title: "Alumni Account Approved",
        message:
          "Your alumni account has been approved. You can now mentor students and post career opportunities.",
        type: "verification",
        link: "/alumni/dashboard",
      });
    } catch (notifErr) {
      console.warn("Notification error:", notifErr.message);
    }

    return sendSuccess(res, "Alumni verification approved successfully", {
      _id: user._id,
      name: user.name,
      email: user.email,
      verificationStatus: "approved",
      isVerified: true,
      verifiedBy: req.user?._id,
      verifiedAt: now,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject alumni verification
// @route   PUT /api/faculty/alumni/:id/reject
// @access  Private (Faculty/Admin)
const rejectAlumni = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, "Alumni user not found", 404);
    }

    if (user.role !== "Alumni") {
      return sendError(res, "Only alumni accounts can be rejected", 400);
    }

    const now = new Date();
    user.verificationStatus = "rejected";
    user.isVerified = false;
    user.verifiedBy = req.user?._id || null;
    user.verifiedAt = now;
    user.rejectionReason = rejectionReason || "";
    await user.save();

    // Update corresponding AlumniProfile and ensure isMentoring is false
    await AlumniProfile.findOneAndUpdate(
      { user: id },
      {
        verificationStatus: "rejected",
        isMentoring: false,
        verifiedBy: req.user?._id || null,
        verifiedAt: now,
        rejectionReason: rejectionReason || "",
      },
      { new: true }
    );

    const messageContent = rejectionReason
      ? `Your alumni verification request was rejected. Reason: ${rejectionReason}`
      : "Your alumni verification request was rejected. Please contact the college administration.";

    // Send notification to the rejected alumni
    try {
      await Notification.create({
        recipient: user._id,
        sender: req.user?._id,
        title: "Alumni Account Rejected",
        message: messageContent,
        type: "verification",
        link: "/alumni/dashboard",
      });
    } catch (notifErr) {
      console.warn("Notification error:", notifErr.message);
    }

    return sendSuccess(res, "Alumni verification rejected", {
      _id: user._id,
      name: user.name,
      email: user.email,
      verificationStatus: "rejected",
      isVerified: false,
      rejectionReason: user.rejectionReason,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get faculty dashboard statistics
// @route   GET /api/faculty/stats
// @access  Private (Faculty/Admin)
const getFacultyStats = async (req, res, next) => {
  try {
    const studentCount = await User.countDocuments({ role: "Student" });
    const alumniCount = await User.countDocuments({
      role: "Alumni",
      verificationStatus: "approved",
    });
    const pendingCount = await User.countDocuments({
      role: "Alumni",
      verificationStatus: "pending",
    });
    const eventCount = await Event.countDocuments();
    const announcementCount = await Announcement.countDocuments();

    return sendSuccess(res, "Faculty stats retrieved successfully", {
      studentCount: studentCount || 142,
      alumniCount: alumniCount || 68,
      pendingAlumniCount: pendingCount || 0,
      announcementsCount: announcementCount || 2,
      eventsCount: eventCount || 3,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Recommend mentor for a student
// @route   POST /api/faculty/recommend-mentor
// @access  Private (Faculty)
const recommendMentor = async (req, res, next) => {
  try {
    const { studentName, studentRoll, alumniMentor, guidanceArea, facultyNotes } = req.body;
    const recommendation = {
      _id: "rec-" + Date.now(),
      studentName,
      studentRoll,
      alumniMentor,
      guidanceArea,
      facultyNotes,
      createdAt: new Date().toISOString(),
    };
    facultyRecommendations.push(recommendation);
    return sendSuccess(res, "Mentor recommendation submitted successfully", recommendation, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Get faculty profile
// @route   GET /api/faculty/profile
// @access  Private (Faculty)
const getFacultyProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    let profile = null;
    if (userId) {
      profile = await FacultyProfile.findOne({ user: userId }).populate("user", "name email");
    }

    if (!profile) {
      profile = {
        name: "Dr. S. Meenakshi",
        email: "meenakshi.s@eec.srmrmp.edu.in",
        department: "Computer Science and Engineering",
        designation: "Associate Professor & Alumni Coordinator",
        employeeId: "FAC2018CSE04",
        researchAreas: "Cloud Computing, Distributed Systems, Software Engineering",
        officeHours: "Mon-Thu: 02:00 PM - 04:00 PM",
        bio: "Faculty member with 12+ years of teaching and research experience. Passionate about student mentorship.",
      };
    }

    return sendSuccess(res, "Faculty profile retrieved", profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update faculty profile
// @route   PUT /api/faculty/profile
// @access  Private (Faculty)
const updateFacultyProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (userId) {
      let profile = await FacultyProfile.findOne({ user: userId });
      if (!profile) {
        profile = new FacultyProfile({ user: userId });
      }
      const { department, designation, employeeId, researchAreas, officeHours, bio } = req.body;
      if (department !== undefined) profile.department = department;
      if (designation !== undefined) profile.designation = designation;
      if (employeeId !== undefined) profile.employeeId = employeeId;
      if (researchAreas !== undefined)
        profile.researchAreas = Array.isArray(researchAreas)
          ? researchAreas
          : researchAreas.split(",").map((s) => s.trim());
      if (officeHours !== undefined) profile.officeHours = officeHours;
      if (bio !== undefined) profile.bio = bio;
      await profile.save();
    }

    return sendSuccess(res, "Faculty profile updated successfully", req.body);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getPendingAlumni,
  approveAlumni,
  rejectAlumni,
  getFacultyStats,
  recommendMentor,
  getFacultyProfile,
  updateFacultyProfile,
};
