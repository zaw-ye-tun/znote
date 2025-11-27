import jwt from 'jsonwebtoken';

/**
 * JWT Authentication Middleware
 * 
 * This middleware verifies JWT tokens from the Authorization header.
 * It protects routes that require authentication by checking if a valid
 * token exists and extracting the user information from it.
 * 
 * Usage: Add this middleware to any route that needs authentication
 * Example: router.get('/protected', authMiddleware, controller)
 */

export const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    // Expected format: "Bearer <token>"
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'No authorization header provided' 
      });
    }

    // Split "Bearer <token>" and get the token part
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided' 
      });
    }

    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user information to the request object
    // This makes the user ID available in subsequent route handlers
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle various JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired' 
      });
    }
    
    // Generic error fallback
    return res.status(500).json({ 
      error: 'Authentication failed' 
    });
  }
};
