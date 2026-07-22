const express = require('express');
const dotenv = require('dotenv');

// Import database connection
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');

// Load .env file
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Allow server to read JSON
app.use(express.json());

// Use authentication routes
app.use('/api', authRoutes);


// Simple home route
app.get('/', (req, res) => {
  res.json({
    message: 'API is running'
  });
});


// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});