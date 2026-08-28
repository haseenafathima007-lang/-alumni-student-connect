const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/response");

// @desc    Get all users with optional role & search filter
// @route   GET /api/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role && role !== "all") {
      query.role = new RegExp(`^${role}$`, "i");
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const dbUsers = await User.find(query).select("-password").sort({ createdAt: -1 });

    const users = dbUsers.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      department: "Engineering & Tech",
      status: u.isVerified !== false ? "Active" : "Pending",
      joinedDate: u.createdAt ? u.createdAt.toISOString().split("T")[0] : "2026-08-01",
    }));

    return sendSuccess(res, "Users retrieved successfully", users);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Active / Suspended)
// @route   PUT /api/users/:id/status
// @access  Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    user.isVerified = status === "Active";
    await user.save();

    return sendSuccess(res, "User status updated successfully", { id, status });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  toggleUserStatus,
};
