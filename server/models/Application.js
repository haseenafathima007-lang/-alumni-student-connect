const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemType: {
      type: String,
      enum: ["job", "internship"],
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "itemModel",
    },
    itemModel: {
      type: String,
      required: true,
      enum: ["Job", "Internship"],
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    coverNote: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["applied", "under_review", "shortlisted", "rejected", "accepted"],
      default: "applied",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);
