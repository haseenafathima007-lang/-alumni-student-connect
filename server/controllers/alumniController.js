const AlumniProfile = require("../models/AlumniProfile");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/response");

// Fallback seed data if DB has no alumni yet
const defaultAlumni = [
  {
    _id: "demo-alumni-1",
    name: "Arun Kumar",
    role: "Alumni",
    email: "arun.kumar@tcs.example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    profile: {
      company: "Tata Consultancy Services (TCS)",
      jobTitle: "Senior Software Engineer",
      industry: "Information Technology",
      graduationYear: "2022",
      department: "Computer Science and Engineering",
      location: "Chennai, India",
      expertise: ["Java", "React", "Node.js", "System Design"],
      bio: "Passionate engineer with 4+ years of industry experience. Happy to mentor juniors on full-stack architecture and placement preparation.",
      isMentoring: true,
      mentorshipTopics: ["Full Stack Web Dev", "Mock Interviews", "Resume Review"],
    },
  },
  {
    _id: "demo-alumni-2",
    name: "Priya Sharma",
    role: "Alumni",
    email: "priya.sharma@zoho.example.com",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    profile: {
      company: "Zoho Corporation",
      jobTitle: "Lead Data Analyst",
      industry: "SaaS / Analytics",
      graduationYear: "2021",
      department: "Information Technology",
      location: "Bengaluru, India",
      expertise: ["Python", "SQL", "Power BI", "Machine Learning"],
      bio: "Specializing in business intelligence and data pipelines. Looking forward to guiding enthusiastic students interested in Data Science careers.",
      isMentoring: true,
      mentorshipTopics: ["Data Analytics", "SQL Mastery", "Career Transition"],
    },
  },
  {
    _id: "demo-alumni-3",
    name: "Rahul Raj",
    role: "Alumni",
    email: "rahul.raj@infosys.example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    profile: {
      company: "Infosys",
      jobTitle: "Cloud Solutions Architect",
      industry: "Cloud & DevOps",
      graduationYear: "2020",
      department: "Electronics & Communication",
      location: "Hyderabad, India",
      expertise: ["AWS", "Docker", "Kubernetes", "Microservices"],
      bio: "Cloud specialist helping organizations scale modern cloud-native apps. Always open to sharing insights on certifications and career paths.",
      isMentoring: true,
      mentorshipTopics: ["DevOps & Cloud", "AWS Certifications", "Tech Career Coaching"],
    },
  },
  {
    _id: "demo-alumni-4",
    name: "Sneha Patel",
    role: "Alumni",
    email: "sneha.p@google.example.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    profile: {
      company: "Google",
      jobTitle: "Product Manager",
      industry: "Big Tech / Product Management",
      graduationYear: "2019",
      department: "Computer Science and Engineering",
      location: "Bengaluru, India",
      expertise: ["Product Strategy", "Agile", "User Research", "Metrics"],
      bio: "Product leader enthusiastic about mentoring aspiring APMs and engineering graduates transitioning to product management.",
      isMentoring: true,
      mentorshipTopics: ["Product Management", "Cracking APM Roles", "System Design"],
    },
  },
];

// @desc    Get all alumni with multi-criteria search, filters, & weighted mentor matching
// @route   GET /api/alumni
// @access  Public
const getAllAlumni = async (req, res, next) => {
  try {
    const {
      search,
      department,
      batch,
      company,
      industry,
      jobTitle,
      topic,
      skill,
      mentoring,
    } = req.query;

    let query = {};
    if (department && department !== "all") query.department = new RegExp(department, "i");
    if (batch && batch !== "all") query.graduationYear = batch;
    if (company && company !== "all") query.company = new RegExp(company, "i");
    if (industry && industry !== "all") query.industry = new RegExp(industry, "i");
    if (jobTitle && jobTitle !== "all") query.jobTitle = new RegExp(jobTitle, "i");
    if (mentoring === "true") query.isMentoring = true;

    let alumniProfiles = await AlumniProfile.find(query).populate(
      "user",
      "name email avatar role isVerified verificationStatus"
    );

    let results = [];
    if (alumniProfiles.length > 0) {
      results = alumniProfiles
        .filter((p) => p.user && (p.user.verificationStatus === "approved" || p.user.isVerified))
        .map((p) => ({
          _id: p._id,
          userId: p.user._id,
          name: p.user.name,
          email: p.user.email,
          avatar: p.user.avatar,
          role: p.user.role,
          verificationStatus: p.user.verificationStatus || (p.user.isVerified ? "approved" : "pending"),
          isVerified: p.user.isVerified || false,
          profile: {
            company: p.company,
            jobTitle: p.jobTitle,
            industry: p.industry,
            graduationYear: p.graduationYear,
            department: p.department,
            location: p.location,
            expertise: p.expertise || [],
            bio: p.bio,
            linkedIn: p.linkedIn,
            github: p.github,
            website: p.website,
            isMentoring: p.isMentoring,
            mentorshipTopics: p.mentorshipTopics || [],
          },
          matchScore: 0,
        }));
    } else {
      results = defaultAlumni.map((a) => ({ ...a, matchScore: 0 }));
    }

    // Apply weighted matching & search
    const searchTerm = search ? search.toLowerCase().trim() : "";
    const filterTopic = topic ? topic.toLowerCase().trim() : "";
    const filterSkill = skill ? skill.toLowerCase().trim() : "";

    results = results.map((item) => {
      let score = 0;
      const p = item.profile;

      if (p.isMentoring) score += 2;

      if (searchTerm) {
        if (item.name?.toLowerCase().includes(searchTerm)) score += 5;
        if (p.company?.toLowerCase().includes(searchTerm)) score += 4;
        if (p.jobTitle?.toLowerCase().includes(searchTerm)) score += 4;
        if (p.department?.toLowerCase().includes(searchTerm)) score += 3;
        if (p.expertise?.some((e) => e.toLowerCase().includes(searchTerm))) score += 5;
        if (p.mentorshipTopics?.some((t) => t.toLowerCase().includes(searchTerm))) score += 4;
      }

      if (filterTopic && p.mentorshipTopics?.some((t) => t.toLowerCase().includes(filterTopic))) {
        score += 5;
      }

      if (filterSkill && p.expertise?.some((e) => e.toLowerCase().includes(filterSkill))) {
        score += 5;
      }

      return { ...item, matchScore: score };
    });

    if (searchTerm || filterTopic || filterSkill) {
      results = results.filter((item) => item.matchScore > 0 || !searchTerm);
      results.sort((a, b) => b.matchScore - a.matchScore);
    }

    return sendSuccess(res, "Alumni retrieved successfully", results);
  } catch (error) {
    next(error);
  }
};

// @desc    Get alumni by ID
// @route   GET /api/alumni/:id
// @access  Public
const getAlumniById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const fallback = defaultAlumni.find((a) => a._id === id || a.userId === id);
    if (fallback) {
      return sendSuccess(res, "Alumni retrieved successfully", fallback);
    }

    const profile = await AlumniProfile.findById(id).populate(
      "user",
      "name email avatar role"
    );

    if (!profile) {
      return sendError(res, "Alumni not found", 404);
    }

    return sendSuccess(res, "Alumni retrieved successfully", {
      _id: profile._id,
      userId: profile.user?._id,
      name: profile.user?.name,
      email: profile.user?.email,
      avatar: profile.user?.avatar,
      role: profile.user?.role,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update alumni profile
// @route   PUT /api/alumni/profile
// @access  Private (Alumni only)
const updateAlumniProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let profile = await AlumniProfile.findOne({ user: userId });

    if (!profile) {
      profile = new AlumniProfile({ user: userId });
    }

    const {
      company,
      jobTitle,
      industry,
      graduationYear,
      department,
      location,
      expertise,
      bio,
      linkedIn,
      github,
      website,
      isMentoring,
      mentorshipTopics,
    } = req.body;

    const isApproved =
      req.user?.verificationStatus === "approved" ||
      (req.user?.isVerified && req.user?.verificationStatus !== "rejected");

    if (isMentoring !== undefined) {
      if (Boolean(isMentoring) && !isApproved) {
        return sendError(
          res,
          "Your alumni account must be approved by faculty before enabling mentorship.",
          403
        );
      }
      profile.isMentoring = isApproved ? Boolean(isMentoring) : false;
    }

    if (company !== undefined) profile.company = company;
    if (jobTitle !== undefined) profile.jobTitle = jobTitle;
    if (industry !== undefined) profile.industry = industry;
    if (graduationYear !== undefined) profile.graduationYear = graduationYear;
    if (department !== undefined) profile.department = department;
    if (location !== undefined) profile.location = location;
    if (expertise !== undefined)
      profile.expertise = Array.isArray(expertise)
        ? expertise
        : expertise.split(",").map((s) => s.trim());
    if (bio !== undefined) profile.bio = bio;
    if (linkedIn !== undefined) profile.linkedIn = linkedIn;
    if (github !== undefined) profile.github = github;
    if (website !== undefined) profile.website = website;
    if (mentorshipTopics !== undefined)
      profile.mentorshipTopics = Array.isArray(mentorshipTopics)
        ? mentorshipTopics
        : mentorshipTopics.split(",").map((s) => s.trim());

    await profile.save();

    return sendSuccess(res, "Alumni profile updated successfully", profile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAlumni,
  getAlumniById,
  updateAlumniProfile,
};
