const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    date: {
      type: String,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
    },
    location: {
      type: String,
      default: "Online",
    },
    mode: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },
    meetingLink: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["Webinar", "Workshop", "Networking", "Reunion", "Guest Lecture", "Career Talk"],
      default: "Webinar",
    },
    speaker: {
      type: String,
      default: "",
    },
    speakerRole: {
      type: String,
      default: "",
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
