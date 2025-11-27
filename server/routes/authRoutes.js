import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Auth Routes
 * 
 * POST /api/auth/register - Register a new user
 * POST /api/auth/login - Login existing user
 * GET /api/auth/profile - Get current user profile (protected)
 */

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (authentication required)
router.get('/profile', authMiddleware, getProfile);

export default router;
