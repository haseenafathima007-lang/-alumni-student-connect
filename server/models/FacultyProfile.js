const mongoose = require("mongoose");

const facultyProfileSchema = new mongoose.Schema(
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
    designation: {
      type: String,
      default: "Assistant Professor",
    },
    employeeId: {
      type: String,
      default: "",
    },
    researchAreas: {
      type: [String],
      default: [],
    },
    officeHours: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FacultyProfile", facultyProfileSchema);
