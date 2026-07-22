const mongoose = require('mongoose');


// Create Message Schema
const messageSchema = new mongoose.Schema(
  {
    // Conversation where this message belongs
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true
    },

    // User who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Actual message text
    text: {
      type: String,
      required: true,
      trim: true
    }
  },

  // Automatically creates:
  // createdAt
  // updatedAt
  {
    timestamps: true
  }
);


// Create Message Model
const Message = mongoose.model(
  'Message',
  messageSchema
);


module.exports = Message;