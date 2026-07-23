const express =
  require('express');


// Create router

const router =
  express.Router();


// Authentication middleware

const authMiddleware =
  require(
    '../middleware/authMiddleware'
  );


// User controller

const {
  searchUsers
} = require(
  '../controllers/userController'
);


// ==========================================
// SEARCH USERS
// ==========================================

router.get(

  '/users/search',

  authMiddleware,

  searchUsers

);


// Export router

module.exports =
  router;