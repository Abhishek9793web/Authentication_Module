const express = require('express');

const router =
  express.Router();


// Existing authentication middleware
const authenticateToken =
  require('../middleware/authMiddleware');


// Notification controllers
const {

  getNotifications,

  markNotificationAsRead

} = require(
  '../controllers/notificationController'
);


// ==========================================
// GET ALL NOTIFICATIONS
// ==========================================

router.get(

  '/notifications',

  authenticateToken,

  getNotifications

);


// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

router.patch(

  '/notifications/:id/read',

  authenticateToken,

  markNotificationAsRead

);


module.exports = router;