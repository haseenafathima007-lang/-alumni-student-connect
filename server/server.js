const dns = require("dns");
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const alumniRoutes = require("./routes/alumniRoutes");
const studentRoutes = require("./routes/studentRoutes");
const jobRoutes = require("./routes/jobRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const mentorshipRoutes = require("./routes/mentorshipRoutes");
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const userRoutes = require("./routes/userRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const { notFound } = require("./middleware/notFoundMiddleware");
const { errorHandler } = require("./middleware/errorMiddleware");
const emailService = require("./services/emailService");
const { corsOptions } = require("./config/cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Socket.IO configuration
const io = new Server(server, {
  cors: corsOptions,
});

io.on("connection", (socket) => {
  // User joins their personal room for direct messages & notifications
  socket.on("join_user", (userId) => {
    if (userId) {
      socket.join(userId.toString());
    }
  });

  // User joins a specific conversation room
  socket.on("join_conversation", (conversationId) => {
    if (conversationId) {
      socket.join(conversationId.toString());
    }
  });

  // Handle new message dispatch
  socket.on("send_message", (messageData) => {
    if (messageData?.conversation) {
      io.to(messageData.conversation.toString()).emit("receive_message", messageData);
    }
    if (messageData?.recipient) {
      io.to(messageData.recipient.toString()).emit("new_notification", {
        type: "chat",
        title: `Message from ${messageData.senderName || "User"}`,
        message: messageData.text,
      });
    }
  });

  // Handle typing status
  socket.on("typing", ({ conversationId, userId, isTyping }) => {
    socket.to(conversationId).emit("user_typing", { userId, isTyping });
  });

  socket.on("disconnect", () => {});
});

// Pass io to request objects if needed
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Alumni Student Connect API & Socket.IO active!",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      alumni: "/api/alumni",
      students: "/api/student",
      jobs: "/api/jobs",
      internships: "/api/internships",
      mentorship: "/api/mentorship",
      events: "/api/events",
      admin: "/api/admin",
      faculty: "/api/faculty",
      users: "/api/users",
      announcements: "/api/announcements",
      applications: "/api/applications",
      chat: "/api/chat",
      notifications: "/api/notifications",
    },
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Start server
server.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await emailService.verifySMTPConnection();
});
