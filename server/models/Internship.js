const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Internship title is required"],
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
    duration: {
      type: String,
      default: "3 Months",
    },
    stipend: {
      type: String,
      default: "Unpaid",
    },
    internshipType: {
      type: String,
      enum: ["Virtual", "On-site", "Hybrid"],
      default: "Virtual",
    },
    description: {
      type: String,
      required: [true, "Internship description is required"],
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

module.exports = mongoose.model("Internship", internshipSchema);
