const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const AlumniProfile = require("../models/AlumniProfile");
const FacultyProfile = require("../models/FacultyProfile");
const Notification = require("../models/Notification");
const emailService = require("../services/emailService");
const generateToken = require("../utils/generateToken");
const { sendSuccess, sendError } = require("../utils/response");
const { validateRegistrationPayload, validatePassword } = require("../validators/authValidator");

// Seed demo users for immediate login testing
const demoUsers = [
  {
    _id: "demo-student-1",
    name: "Rohan Varma",
    email: "rohan.v@eec.srmrmp.edu.in",
    password: "student123",
    role: "Student",
    isVerified: true,
    verificationStatus: "approved",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  },
  {
    _id: "demo-alumni-1",
    name: "Arun Kumar",
    email: "arun.kumar@gmail.com",
    password: "alumni123",
    role: "Alumni",
    isVerified: true,
    verificationStatus: "approved",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  },
  {
    _id: "demo-faculty-1",
    name: "Dr. S. Meenakshi",
    email: "meenakshi.s@eec.srmrmp.edu.in",
    password: "faculty123",
    role: "Faculty",
    isVerified: true,
    verificationStatus: "approved",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
  },
  {
    _id: "demo-admin-1",
    name: "College Administrator",
    email: "admin@college.edu",
    password: "admin123",
    role: "Admin",
    isVerified: true,
    verificationStatus: "approved",
    avatar: "",
  },
];

let inMemoryUsers = [...demoUsers];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, department, batchStart, batchEnd } = req.body;

    // Validate registration payload with Institutional Email Domain & Password rules
    const validation = validateRegistrationPayload({ name, email, password, role, department });
    if (!validation.isValid) {
      return sendError(res, validation.error, 400);
    }

    const { normalizedEmail, normalizedRole, normalizedName, department: validDept } = validation;

    // Attempt MongoDB save if connected
    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return sendError(res, "This email is already registered. Please use another email or login.", 400);
      }

      const isAlumni = normalizedRole === "Alumni";
      const initialVerificationStatus = isAlumni ? "pending" : "approved";
      const initialIsVerified = !isAlumni;

      const user = await User.create({
        name: normalizedName,
        email: normalizedEmail,
        password,
        role: normalizedRole,
        isVerified: initialIsVerified,
        verificationStatus: initialVerificationStatus,
      });

      const selectedDept = validDept || "Artificial Intelligence and Data Science";

      if (normalizedRole === "Student") {
        await StudentProfile.create({ user: user._id, department: selectedDept });
      } else if (normalizedRole === "Alumni") {
        const bStart = batchStart ? String(batchStart).trim() : "";
        const bEnd = batchEnd ? String(batchEnd).trim() : "";
        const bRange = bStart && bEnd ? `${bStart} – ${bEnd}` : bStart || bEnd || "";

        await AlumniProfile.create({
          user: user._id,
          department: selectedDept,
          batchStart: bStart,
          batchEnd: bEnd,
          batch: bRange,
          graduationYear: bEnd || "",
          verificationStatus: "pending",
        });

        // Send initial "Verification Pending" notification to new alumni
        try {
          await Notification.create({
            recipient: user._id,
            title: "Verification Pending",
            message: "Your alumni account is pending faculty approval.",
            type: "system",
            link: "/alumni/dashboard",
          });
        } catch (notifErr) {
          console.warn("Alumni registration notification warning:", notifErr.message);
        }
      } else if (normalizedRole === "Faculty") {
        await FacultyProfile.create({ user: user._id, department: selectedDept });
      }

      const token = generateToken(user._id);

      return sendSuccess(
        res,
        isAlumni
          ? "Registration successful. Your alumni account is pending faculty approval."
          : "Registration successful",
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
          verificationStatus: user.verificationStatus,
          token,
        },
        201
      );
    }

    // In-memory fallback
    const exists = inMemoryUsers.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      return sendError(res, "This email is already registered. Please use another email or login.", 400);
    }

    const isAlumni = normalizedRole === "Alumni";
    const newUser = {
      _id: "user-" + Date.now(),
      name: normalizedName,
      email: normalizedEmail,
      password,
      role: normalizedRole,
      avatar: "",
      isVerified: !isAlumni,
      verificationStatus: isAlumni ? "pending" : "approved",
      department: validDept || "Artificial Intelligence and Data Science",
    };

    inMemoryUsers.push(newUser);
    const token = generateToken(newUser._id);

    return sendSuccess(
      res,
      isAlumni
        ? "Registration successful. Your alumni account is pending faculty approval."
        : "Registration successful",
      {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        isVerified: newUser.isVerified,
        verificationStatus: newUser.verificationStatus,
        token,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Please provide email and password", 400);
    }

    // 1. Try MongoDB
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);
        return sendSuccess(res, "Login successful", {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
          verificationStatus: user.verificationStatus || (user.isVerified ? "approved" : "pending"),
          token,
        });
      }
    }

    // 2. Try In-Memory Users
    const inMem = inMemoryUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (inMem) {
      const token = generateToken(inMem._id);
      return sendSuccess(res, "Login successful", {
        _id: inMem._id,
        name: inMem.name,
        email: inMem.email,
        role: inMem.role,
        avatar: inMem.avatar,
        isVerified: inMem.isVerified,
        verificationStatus: inMem.verificationStatus || (inMem.isVerified ? "approved" : "pending"),
        token,
      });
    }

    return sendError(res, "Invalid email or password", 401);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1 && req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        return sendSuccess(res, "User retrieved", user);
      }
    }

    const inMem = inMemoryUsers.find((u) => u._id === req.user?._id);
    if (inMem) {
      return sendSuccess(res, "User retrieved", inMem);
    }

    return sendError(res, "User not found", 404);
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Request reset link via Email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, "Please provide your registered email address.", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expireDate = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes expiration
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5174";
    const resetUrl = `${clientUrl}/reset-password/${rawToken}`;

    let userFound = false;
    let userName = "";

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail });
      if (user) {
        userFound = true;
        userName = user.name;
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = expireDate;
        await user.save();
      }
    } else {
      const inMem = inMemoryUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (inMem) {
        userFound = true;
        userName = inMem.name;
        inMem.resetPasswordToken = hashedToken;
        inMem.resetPasswordExpire = expireDate;
      }
    }

    if (userFound) {
      try {
        const sendResult = await emailService.sendPasswordResetEmail({
          to: normalizedEmail,
          name: userName,
          resetUrl,
          expiresInMinutes: 30,
        });

        if (!sendResult.success && sendResult.reason === "SMTP_NOT_CONFIGURED") {
          console.warn(
            `⚠️ [ForgotPassword Warning] Real email cannot be dispatched to ${normalizedEmail} because SMTP_USER and SMTP_PASSWORD are not configured in server/.env.\nReset URL for testing: ${resetUrl}`
          );

          return sendSuccess(
            res,
            "If an account exists with this email address, password reset instructions have been sent.",
            { resetUrl }
          );
        }

        if (sendResult.success) {
          console.log(
            `✅ [ForgotPassword] Password reset email handed to SMTP server for ${normalizedEmail} (Message ID: ${sendResult.messageId})`
          );
          return sendSuccess(
            res,
            "If an account exists with this email address, password reset instructions have been sent.",
            {
              messageId: sendResult.messageId,
              accepted: sendResult.accepted,
              resetUrl: process.env.NODE_ENV !== "production" ? resetUrl : undefined,
            }
          );
        }
      } catch (emailErr) {
        console.error("❌ [ForgotPassword Error] SMTP mail delivery failed:", emailErr.message);
        return sendSuccess(
          res,
          "If an account exists with this email address, password reset instructions have been sent.",
          {
            resetUrl,
            error: emailErr.message,
          }
        );
      }
    }

    // Generic security response for unregistered email (anti-enumeration)
    return sendSuccess(
      res,
      "If an account exists with this email address, password reset instructions have been sent."
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Diagnostic test email endpoint
// @route   POST /api/auth/test-email
// @access  Public
const testEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return sendError(res, "Please provide recipient email address", 400);
    }
    const result = await emailService.sendTestEmail(email.trim());
    if (!result.success) {
      return sendError(
        res,
        `SMTP Test Email Failed: ${result.error || result.reason}. Check server/.env credentials.`,
        500,
        result
      );
    }
    return sendSuccess(
      res,
      `Test email sent successfully to ${email}! Check your Gmail inbox and spam folder.`,
      result
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password with secure token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return sendError(res, "Password reset token is missing.", 400);
    }

    if (!password) {
      return sendError(res, "Please enter a new password.", 400);
    }

    const passCheck = validatePassword(password);
    if (!passCheck.isValid) {
      return sendError(res, passCheck.error, 400);
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: new Date() },
      });

      if (!user) {
        return sendError(res, "Invalid or expired password reset token.", 400);
      }

      user.password = password; // Mongoose pre-save hook will hash it with bcrypt
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await user.save();

      return sendSuccess(
        res,
        "Password reset successfully. You can now log in with your new password."
      );
    }

    // In-memory fallback
    const inMem = inMemoryUsers.find(
      (u) =>
        u.resetPasswordToken === hashedToken &&
        u.resetPasswordExpire &&
        new Date(u.resetPasswordExpire) > new Date()
    );

    if (!inMem) {
      return sendError(res, "Invalid or expired password reset token.", 400);
    }

    inMem.password = password;
    inMem.resetPasswordToken = null;
    inMem.resetPasswordExpire = null;

    return sendSuccess(
      res,
      "Password reset successfully. You can now log in with your new password."
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  testEmail,
};
