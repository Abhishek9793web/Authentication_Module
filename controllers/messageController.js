const Conversation =
  require('../models/Conversation');

const Message =
  require('../models/Message');

const {
  createMessageNotifications
} =
  require('../services/notificationService');


// ==========================================
// SEND MESSAGE
// ==========================================

const sendMessage = async (
  req,
  res
) => {

  try {

    const {
      conversationId
    } = req.params;

    const {
      text
    } = req.body;

    const senderId =
      req.user.id;

    // Check message
    if (
      !text ||
      text.trim() === ''
    ) {

      return res.status(400).json({

        message:
          'Message text is required'

      });

    }


    // Find conversation
    const conversation =
      await Conversation.findById(
        conversationId
      );

    // Check conversation
    if (!conversation) {

      return res.status(404).json({

        message:
          'Conversation not found'

      });

    }


    // Check sender
    const isParticipant =
      conversation.participants.some(

        id =>
          id.toString() ===
          senderId.toString()

      );


    if (!isParticipant) {

      return res.status(403).json({

        message:
          'You are not part of this conversation'

      });

    }


    // Create message
    const message =
      await Message.create({

        conversation:
          conversationId,

        sender:
          senderId,

        text:
          text.trim()

      });

    // ==========================================
    // CREATE NOTIFICATIONS
    // ==========================================

    await createMessageNotifications({

      io:
        req.app.get('io'),

      senderId,

      conversationId,

      messageId:
        message._id,

      participants:
        conversation.participants

    });

    // ==========================================
    // SEND REAL-TIME MESSAGE
    // ==========================================

    const io =
      req.app.get('io');


    io.to(
      `conversation_${conversationId}`
    ).emit(
      'newMessage',
      message
    );

    return res.status(201).json({

      message:
        'Message sent successfully',

      data:
        message

    });

  } catch (error) {

    console.error(
      'Send message error:',
      error
    );

    return res.status(500).json({

      message:
        'Something went wrong'

    });

  }

};

const getMessages = async (
  req,
  res
) => {

  try {

    const {
      conversationId
    } = req.params;

    const userId = req.user.id;

    const conversation =
      await Conversation.findById(
        conversationId
      );

    if (!conversation) {
      return res.status(404).json({
        message:
          'Conversation not found'
      });
    }

    const isParticipant =
      conversation.participants.some(
        id =>
          id.toString() ===
          userId.toString()
      );

    if (!isParticipant) {
      return res.status(403).json({
        message:
          'You are not part of this conversation'
      });
    }

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
      message:
        'Messages fetched successfully',
      messages
    });

  } catch (error) {

    console.error(
      'Get messages error:',
      error
    );

    return res.status(500).json({
      message:
        'Something went wrong'
    });
  }
};

module.exports = {
  sendMessage,
  getMessages
};