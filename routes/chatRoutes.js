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


module.exports = router;