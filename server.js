// Import Express
const express = require('express');

// Import HTTP module
const http = require('http');

// Import dotenv
const dotenv = require('dotenv');

// Import Socket.IO
const { Server } = require('socket.io');


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
    // Change this to your frontend URL
    // when you connect your React application
    origin: '*',

    methods: [
      'GET',
      'POST'
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

