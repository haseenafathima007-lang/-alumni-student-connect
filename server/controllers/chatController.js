const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/response");

// @desc    Get or create 1-on-1 conversation with another user
// @route   POST /api/chat/conversation
// @access  Private
const getOrCreateConversation = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return sendError(res, "targetUserId is required", 400);
    }

    if (currentUserId.toString() === targetUserId.toString()) {
      return sendError(res, "Cannot start conversation with yourself", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(currentUserId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return sendError(res, "Invalid user ID", 400);
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, targetUserId] },
    }).populate("participants", "name email role avatar");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, targetUserId],
        lastMessageText: "Conversation started",
        lastMessageAt: new Date(),
      });
      conversation = await conversation.populate("participants", "name email role avatar");
    }

    return sendSuccess(res, "Conversation ready", conversation);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations for logged-in user
// @route   GET /api/chat/conversations
// @access  Private
const getUserConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return sendSuccess(res, "Conversations retrieved successfully", []);
    }

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email role avatar")
      .sort({ lastMessageAt: -1 });

    return sendSuccess(res, "Conversations retrieved successfully", conversations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:conversationId
// @access  Private
const getConversationMessages = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return sendError(res, "Invalid ID", 400);
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return sendError(res, "Conversation not found", 404);
    }

    // Security & Authorization Check
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === userId.toString()
    );

    if (!isParticipant) {
      return sendError(res, "Unauthorized to access this conversation", 403);
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name email role avatar")
      .populate("recipient", "name email role avatar")
      .sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      { conversation: conversationId, recipient: userId, isRead: false },
      { $set: { isRead: true } }
    );

    return sendSuccess(res, "Messages retrieved successfully", messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message in a conversation
// @route   POST /api/chat/message
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const { conversationId, text, recipientId } = req.body;

    if (!text || !text.trim()) {
      return sendError(res, "Message text cannot be empty", 400);
    }

    let conversation = null;
    let targetRecipientId = recipientId;

    if (conversationId) {
      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return sendError(res, "Invalid conversation ID", 400);
      }
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return sendError(res, "Conversation not found", 404);
      }

      // Authorization Check
      const isParticipant = conversation.participants.some(
        (p) => p.toString() === senderId.toString()
      );
      if (!isParticipant) {
        return sendError(res, "Unauthorized to send message in this conversation", 403);
      }

      targetRecipientId = conversation.participants.find(
        (p) => p.toString() !== senderId.toString()
      );
    } else if (recipientId) {
      if (!mongoose.Types.ObjectId.isValid(recipientId)) {
        return sendError(res, "Invalid recipient ID", 400);
      }
      conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, recipientId],
        });
      }
    } else {
      return sendError(res, "conversationId or recipientId is required", 400);
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: senderId,
      recipient: targetRecipientId,
      text: text.trim(),
    });

    // Update conversation metadata
    conversation.lastMessage = message._id;
    conversation.lastMessageText = text.trim();
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Trigger in-app notification for recipient
    try {
      await Notification.create({
        recipient: targetRecipientId,
        sender: senderId,
        title: `New Message from ${req.user.name || "User"}`,
        message: text.trim().length > 60 ? text.trim().substring(0, 57) + "..." : text.trim(),
        type: "chat",
        link: req.user.role === "Student" ? "/alumni/chat" : "/student/chat",
      });
    } catch (notifErr) {
      console.warn("Chat notification error:", notifErr.message);
    }

    const populated = await Message.findById(message._id)
      .populate("sender", "name email role avatar")
      .populate("recipient", "name email role avatar");

    return sendSuccess(res, "Message sent successfully", populated, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrCreateConversation,
  getUserConversations,
  getConversationMessages,
  sendMessage,
};
