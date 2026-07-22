const Conversation = require('../models/Conversation');
const Message = require('../models/Message');


// ======================================================
// SEND MESSAGE
// POST /api/conversations/:conversationId/messages
// ======================================================

const sendMessage = async (req, res) => {
  try {

    // Get conversation ID from URL
    const { conversationId } = req.params;

    // Get message text
    const { text } = req.body;

    // Logged-in user
    const userId = req.user.id;


    // Check message text
    if (!text || text.trim() === '') {
      return res.status(400).json({
        message: 'Message text is required'
      });
    }


    // Find conversation
    const conversation =
      await Conversation.findById(
        conversationId
      );


    // Check conversation exists
    if (!conversation) {
      return res.status(404).json({
        message: 'Conversation not found'
      });
    }


    // Check if user is part of conversation
    const isParticipant =
      conversation.participants.some(
        id =>
          id.toString() === userId.toString()
      );


    // User is not allowed
    if (!isParticipant) {
      return res.status(403).json({
        message:
          'You cannot send messages to this conversation'
      });
    }


    // Create message
    const message = await Message.create({

      // Which conversation?
      conversation: conversationId,

      // Who sent it?
      sender: userId,

      // Message text
      text: text.trim()
    });


    // Return message
    return res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });

  } catch (error) {

    console.error(
      'Send message error:',
      error
    );

    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
};


// ======================================================
// GET CONVERSATION MESSAGES
// GET /api/conversations/:conversationId/messages
// ======================================================

const getMessages = async (req, res) => {
  try {

    // Get conversation ID
    const { conversationId } = req.params;

    // Logged-in user
    const userId = req.user.id;


    // Find conversation
    const conversation =
      await Conversation.findById(
        conversationId
      );


    // Conversation doesn't exist
    if (!conversation) {
      return res.status(404).json({
        message: 'Conversation not found'
      });
    }


    // Check if user is participant
    const isParticipant =
      conversation.participants.some(
        id =>
          id.toString() === userId.toString()
      );


    // Only participants can read messages
    if (!isParticipant) {
      return res.status(403).json({
        message:
          'You cannot access this conversation'
      });
    }


    // Get messages
    const messages =
      await Message.find({
        conversation: conversationId
      })
      .populate(
        'sender',
        'name email'
      )
      .sort({
        createdAt: 1
      });


    return res.status(200).json({
      message: 'Messages fetched successfully',
      messages
    });

  } catch (error) {

    console.error(
      'Get messages error:',
      error
    );

    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
};


module.exports = {
  sendMessage,
  getMessages
};