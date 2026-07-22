const mongoose = require('mongoose');

const Conversation = require('../models/Conversation');
const User = require('../models/User');


// ======================================================
// CREATE CONVERSATION
// POST /api/conversations
// ======================================================

const createConversation = async (req, res) => {
  try {

    // Get participants from request
    const { participants } = req.body;

    // Get logged-in user ID
    // This comes from JWT authentication middleware
    const loggedInUserId = req.user.id;


    // Check if participants is an array
    if (
      !participants ||
      !Array.isArray(participants) ||
      participants.length === 0
    ) {
      return res.status(400).json({
        message: 'Participants are required'
      });
    }


    // Add logged-in user to participants
    // This ensures creator is also part of conversation
    const allParticipants = [
      loggedInUserId,
      ...participants
    ];


    // Remove duplicate user IDs
    const uniqueParticipants = [
      ...new Set(
        allParticipants.map(id => id.toString())
      )
    ];


    // Check if all users exist
    const users = await User.find({
      _id: {
        $in: uniqueParticipants
      }
    });


    // If number doesn't match,
    // some user IDs are invalid
    if (users.length !== uniqueParticipants.length) {
      return res.status(400).json({
        message: 'One or more participants are invalid'
      });
    }


    // Create conversation
    const conversation = await Conversation.create({
      participants: uniqueParticipants
    });


    // Return created conversation
    return res.status(201).json({
      message: 'Conversation created successfully',
      conversation
    });

  } catch (error) {

    console.error(
      'Create conversation error:',
      error
    );

    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
};


// ======================================================
// ADD PARTICIPANTS
// POST /api/conversations/:conversationId/participants
// ======================================================

const addParticipants = async (req, res) => {
  try {

    const { conversationId } = req.params;
    const { participants } = req.body;

    // Current logged-in user
    const loggedInUserId = req.user.id;


    // Validate participants
    if (
      !participants ||
      !Array.isArray(participants) ||
      participants.length === 0
    ) {
      return res.status(400).json({
        message: 'Participants are required'
      });
    }


    // Find conversation
    const conversation = await Conversation.findById(
      conversationId
    );


    if (!conversation) {
      return res.status(404).json({
        message: 'Conversation not found'
      });
    }


    // Check if logged-in user is a participant
    const isParticipant =
      conversation.participants.some(
        id => id.toString() === loggedInUserId.toString()
      );


    if (!isParticipant) {
      return res.status(403).json({
        message: 'You are not part of this conversation'
      });
    }


    // Check whether new users exist
    const users = await User.find({
      _id: {
        $in: participants
      }
    });


    if (users.length !== participants.length) {
      return res.status(400).json({
        message: 'One or more participants are invalid'
      });
    }


    // Add new participants
    conversation.participants.push(
      ...participants
    );


    // Remove duplicates
    conversation.participants = [
      ...new Map(
        conversation.participants.map(id => [
          id.toString(),
          id
        ])
      ).values()
    ];


    // Save conversation
    await conversation.save();


    return res.status(200).json({
      message: 'Participants added successfully',
      conversation
    });

  } catch (error) {

    console.error(
      'Add participants error:',
      error
    );

    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
};


// ======================================================
// GET MY CONVERSATIONS
// GET /api/conversations
// ======================================================

const getMyConversations = async (req, res) => {
  try {

    // Get logged-in user ID
    const userId = req.user.id;


    // Find conversations where
    // logged-in user is a participant
    const conversations =
      await Conversation.find({
        participants: userId
      })
      .populate(
        'participants',
        'name email'
      )
      .sort({
        updatedAt: -1
      });


    return res.status(200).json({
      message: 'Conversations fetched successfully',
      conversations
    });

  } catch (error) {

    console.error(
      'Get conversations error:',
      error
    );

    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
};


module.exports = {
  createConversation,
  addParticipants,
  getMyConversations
};