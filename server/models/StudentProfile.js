const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    department: {
      type: String,
      default: "",
    },
    batch: {
      type: String,
      default: "",
    },
    rollNumber: {
      type: String,
      default: "",
    },
    cgpa: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    careerInterests: {
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
    resumeUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
