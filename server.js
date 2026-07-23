// Import Express
const express = require('express');

// Import HTTP module
const http = require('http');

// Import dotenv
const dotenv = require('dotenv');

// Import Socket.IO
const { Server } = require('socket.io');

// Import CORS
const cors = require('cors');

// Import routes
const userRoutes =
  require('./routes/userRoutes');

// ==========================================
// IMPORT DATABASE CONNECTION
// ==========================================

const connectDB = require('./config/db');


// ==========================================
// IMPORT ROUTES
// ==========================================

// Authentication routes
const authRoutes = require('./routes/authRoutes');

// Chat routes
const chatRoutes = require('./routes/chatRoutes');

// Notification routes
const notificationRoutes =
  require('./routes/notificationRoutes');


// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================

dotenv.config();


// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();


// ==========================================
// CREATE HTTP SERVER
// ==========================================

// Socket.IO needs an HTTP server
// instead of directly using app.listen()
const server = http.createServer(app);


// ==========================================
// CREATE SOCKET.IO SERVER
// ==========================================

const io = new Server(server, {

  cors: {
     // Allow React frontend
    origin: 'http://localhost:5173',

    // Allow these methods
    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE'
    ]
  }

});


// ==========================================
// MAKE SOCKET.IO AVAILABLE
// IN EXPRESS CONTROLLERS
// ==========================================

// Now we can access Socket.IO inside
// controllers using:
//
// const io = req.app.get('io');

app.set('io', io);


// ==========================================
// CONNECT TO MONGODB
// ==========================================

connectDB();

// ==========================================
// CORS MIDDLEWARE
// ==========================================

// Allow React frontend to communicate
// with Node.js backend

app.use(
  cors({
    origin: 'http://localhost:5173',

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE'
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ]
  })
);


// ==========================================
// MIDDLEWARE
// ==========================================

// Allow server to read JSON request body
app.use(express.json());


// ==========================================
// API ROUTES
// ==========================================

// Authentication APIs
//
// POST /api/register
// POST /api/login
// GET  /api/profile
app.use('/api', authRoutes);


// Chat APIs
//
// POST /api/conversations
// POST /api/conversations/:id/participants
// GET  /api/conversations
// POST /api/conversations/:id/messages
// GET  /api/conversations/:id/messages
app.use('/api', chatRoutes);



// ==========================================
// USER ROUTES
// ==========================================

app.use(
  '/api',
  userRoutes
);



// Notification APIs
//
// GET   /api/notifications
// PATCH /api/notifications/:id/read
app.use('/api', notificationRoutes);


// ==========================================
// SIMPLE HOME ROUTE
// ==========================================

app.get('/', (req, res) => {

  res.json({
    message: 'API is running'
  });

});


// ==========================================
// SOCKET.IO CONNECTION
// ==========================================

const setupSocket = require('./socket/socketHandler');

setupSocket(io);

// ==========================================
// START SERVER
// ==========================================

const PORT =
  process.env.PORT || 3000;


// IMPORTANT:
// Use server.listen()
// instead of app.listen()
// because Socket.IO is attached to server.

server.listen(
  PORT,
  () => {

    console.log(
      `Server running on port ${PORT}`
    );

  }
);

