const mongoose = require("mongoose");

const alumniProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    company: {
      type: String,
      default: "",
    },
    jobTitle: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      default: "",
    },
    graduationYear: {
      type: String,
      default: "",
    },
    batchStart: {
      type: String,
      default: "",
    },
    batchEnd: {
      type: String,
      default: "",
    },
    batch: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    expertise: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    linkedIn: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    isMentoring: {
      type: Boolean,
      default: true,
    },
    mentorshipTopics: {
      type: [String],
      default: [],
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.Mixed,
      ref: "User",
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AlumniProfile", alumniProfileSchema);
