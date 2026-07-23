const mongoose = require('mongoose');


// Create Notification Schema
const notificationSchema = new mongoose.Schema(
  {
    // User who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // User who should receive the notification
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Conversation where the message was sent
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true
    },

    // Message that caused the notification
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      required: true
    },

    // Whether the notification has been read
    isRead: {
      type: Boolean,
      default: false
    }
  },

  // Automatically creates:
  // createdAt
  // updatedAt
  {
    timestamps: true
  }
);


// Create Notification Model
const Notification = mongoose.model(
  'Notification',
  notificationSchema
);


module.exports = Notification;