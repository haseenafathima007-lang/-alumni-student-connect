const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const { sendSuccess, sendError } = require("../utils/response");

// @desc    Get current user's notifications
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return sendSuccess(res, "Notifications retrieved successfully", []);
    }

    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "name email role avatar")
      .sort({ createdAt: -1 })
      .limit(50);

    return sendSuccess(res, "Notifications retrieved successfully", notifications);
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return sendSuccess(res, "Unread count retrieved", { count: 0 });
    }

    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    return sendSuccess(res, "Unread count retrieved", { count });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
      return sendSuccess(res, "Notification marked as read", { _id: id, isRead: true });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return sendError(res, "Notification not found", 404);
    }

    return sendSuccess(res, "Notification marked as read", notification);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      await Notification.updateMany(
        { recipient: userId, isRead: false },
        { $set: { isRead: true } }
      );
    }

    return sendSuccess(res, "All notifications marked as read");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
