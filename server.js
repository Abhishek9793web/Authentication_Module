
// Import required packages
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create Express application
const app = express();

// This allows our server to read JSON data
app.use(express.json());

// Temporary array to store users
// NOTE: Data will be lost when the server restarts
const users = [];

// Secret key used to create JWT tokens
// In a real project, keep this in a .env file
const JWT_SECRET = 'my_secret_key';


// ======================================================
// REGISTER API
// ======================================================

app.post('/api/register', async (req, res) => {
  try {
    // Get user information from request body
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required'
      });
    }

    // Check if email is already registered
    const existingUser = users.find(
      (user) => user.email === email
    );

    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists'
      });
    }

    // Convert the password into a secure hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = {
      id: users.length + 1,
      name: name,
      email: email,
      password: hashedPassword
    };

    // Add the new user to our users array
    users.push(newUser);

    // Send success response
    return res.status(201).json({
      message: 'User registered successfully',

      // Do not send the password in the response
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    // Handle unexpected errors
    console.error(error);

    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
});


// ======================================================
// LOGIN API
// ======================================================

app.post('/api/login', async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find the user using their email
    const user = users.find(
      (user) => user.email === email
    );

    // If user does not exist
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Compare the entered password
    // with the hashed password stored in our array
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    // If password is incorrect
    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // If email and password are correct,
    // create a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    // Send successful login response
    return res.status(200).json({
      message: 'Login successful',

      // Send JWT token to the user
      token: token,

      // Send user information
      // but never send the password
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    // Handle unexpected errors
    console.error(error);

    return res.status(500).json({
      message: 'Something went wrong'
    });
  }
});


// ======================================================
// START SERVER
// ======================================================

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

