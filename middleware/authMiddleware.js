const jwt = require('jsonwebtoken');

// Middleware to check JWT token
const authenticateToken = (req, res, next) => {

  // Get Authorization header
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json({
      message: 'Access denied. No token provided'
    });
  }

  // Authorization header format:
  //
  // Bearer YOUR_TOKEN
  //
  // We only need the token
  const token = authHeader.split(' ')[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      message: 'Invalid token format'
    });
  }

  try {

    // Verify JWT token
    const decodedUser = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store user information
    // inside req.user
    req.user = decodedUser;

    // Continue to controller
    next();

  } catch (error) {

    // Token is invalid or expired
    return res.status(403).json({
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authenticateToken;