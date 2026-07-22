const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');


// ==========================================
// REGISTER USER
// POST /api/register
// ==========================================

const register = async (req, res) => {
  try {

    // Get user details from request
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      email: email
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists with this email'
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create new user in MongoDB
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword
    });

    // Send response
    return res.status(201).json({
      message: 'User registered successfully',

      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {

    console.error('Register Error:', error);

    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
};


// ==========================================
// LOGIN USER
// POST /api/login
// ==========================================

const login = async (req, res) => {
  try {

    // Get email and password
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find user in MongoDB
    const user = await User.findOne({
      email: email
    });

    // User does not exist
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Compare entered password
    // with hashed password from MongoDB
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    // Wrong password
    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },

      // Secret key from .env
      process.env.JWT_SECRET,

      {
        expiresIn: '1h'
      }
    );

    // Send response
    return res.status(200).json({
      message: 'Login successful',

      token: token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error('Login Error:', error);

    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
};


// ==========================================
// GET USER PROFILE
// GET /api/profile
// Protected API
// ==========================================

const getProfile = async (req, res) => {
  try {

    // req.user.id comes from JWT middleware
    const userId = req.user.id;

    // Find user in MongoDB
    const user = await User.findById(userId)
      .select('-password');

    // User not found
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Return user profile
    return res.status(200).json({
      message: 'Profile fetched successfully',
      user: user
    });

  } catch (error) {

    console.error('Profile Error:', error);

    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
};


// Export functions
module.exports = {
  register,
  login,
  getProfile
};