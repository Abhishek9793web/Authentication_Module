const mongoose = require('mongoose');

// Create User Schema
const userSchema = new mongoose.Schema(
  {
    // User name
    name: {
      type: String,
      required: true
    },

    // User email
    email: {
      type: String,
      required: true,
      unique: true
    },

    // User password
    // We will store the hashed password here
    password: {
      type: String,
      required: true
    }
  },

  // Automatically add createdAt and updatedAt
  {
    timestamps: true
  }
);

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;