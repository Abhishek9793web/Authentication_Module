const express = require('express');

const router = express.Router();

// Import controllers
const {
  register,
  login,
  getProfile
} = require('../controllers/authController');

// Import JWT middleware
const authenticateToken = require('../middleware/authMiddleware');


// ==========================================
// REGISTER
// POST /api/register
// ==========================================

router.post('/register', register);


// ==========================================
// LOGIN
// POST /api/login
// ==========================================

router.post('/login', login);


// ==========================================
// PROFILE
// GET /api/profile
// Protected by JWT
// ==========================================

router.get(
  '/profile',
  authenticateToken,
  getProfile
);


// Export router
module.exports = router;