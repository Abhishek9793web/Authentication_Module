const mongoose = require('mongoose');


// Create Conversation Schema
const conversationSchema = new mongoose.Schema(
  {
    // Users who are part of this conversation
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    ]
  },

  // Automatically creates:
  // createdAt
  // updatedAt
  {
    timestamps: true
  }
);


// Create Conversation Model
const Conversation = mongoose.model(
  'Conversation',
  conversationSchema
);


module.exports = Conversation;