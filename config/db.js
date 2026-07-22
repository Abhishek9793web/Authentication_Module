const mongoose = require('mongoose');

// Function to connect MongoDB
const connectDB = async () => {
  try {

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected successfully');

  } catch (error) {

    console.error(
      'MongoDB connection failed:',
      error.message
    );

    // Stop application if database connection fails
    process.exit(1);
  }
};

module.exports = connectDB;