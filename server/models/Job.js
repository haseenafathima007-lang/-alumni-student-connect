const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      default: "Remote",
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Remote", "Hybrid"],
      default: "Full-time",
    },
    experienceLevel: {
      type: String,
      default: "Entry Level",
    },
    salary: {
      type: String,
      default: "Not Disclosed",
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    requirements: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicationLink: {
      type: String,
      default: "",
    },
    deadline: {
      type: Date,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
