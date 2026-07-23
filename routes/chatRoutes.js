const express = require('express');

const router = express.Router();


// Existing JWT authentication middleware
const authenticateToken =
  require('../middleware/authMiddleware');


// Conversation controllers
const {
  createConversation,
  addParticipants,
  getMyConversations
} = require('../controllers/conversationController');


// Message controllers
const {
  sendMessage,
  getMessages
} = require('../controllers/messageController');


// ======================================================
// CONVERSATION ROUTES
// ======================================================


// Create conversation
router.post(
  '/conversations',
  authenticateToken,
  createConversation
);


// Add participants
router.post(
  '/conversations/:conversationId/participants',
  authenticateToken,
  addParticipants
);


// Get my conversations
router.get(
  '/conversations',
  authenticateToken,
  getMyConversations
);


// ======================================================
// MESSAGE ROUTES
// ======================================================


// Send message
router.post(
  '/conversations/:conversationId/messages',
  authenticateToken,
  sendMessage
);


// Get conversation messages
router.get(
  '/conversations/:conversationId/messages',
  authenticateToken,
  getMessages
);


const {
  setActiveChat,
  removeActiveChat
} = require('../services/activeChatService');


// User opens conversation
router.post(
  '/conversations/:conversationId/active',
  authenticateToken,
  (req, res) => {

    setActiveChat(
      req.user.id,
      req.params.conversationId
    );

    res.status(200).json({
      message:
        'Conversation marked as active'
    });
  }
);


// User leaves conversation
router.delete(
  '/conversations/:conversationId/active',
  authenticateToken,
  (req, res) => {

    removeActiveChat(
      req.user.id
    );

    res.status(200).json({
      message:
        'Conversation marked as inactive'
    });
  }
);


module.exports = router;