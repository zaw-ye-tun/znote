import express from 'express';
import { 
  getIdeas, 
  getIdeaById, 
  createIdea, 
  updateIdea, 
  deleteIdea,
  bulkCreateIdeas,
  searchIdeas 
} from '../controllers/ideasController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Ideas Routes
 * 
 * All routes require authentication (authMiddleware)
 * 
 * GET /api/ideas - Get all ideas for current user (supports ?category= filter)
 * GET /api/ideas/search - Search ideas by text or tags (?query=)
 * GET /api/ideas/:id - Get specific idea by ID
 * POST /api/ideas - Create a new idea
 * PUT /api/ideas/:id - Update existing idea
 * DELETE /api/ideas/:id - Delete an idea
 * POST /api/ideas/sync - Bulk create ideas (for syncing guest data)
 */

// All routes are protected
router.use(authMiddleware);

// Search route (must be before /:id to avoid conflict)
router.get('/search', searchIdeas);

// CRUD routes
router.get('/', getIdeas);
router.get('/:id', getIdeaById);
router.post('/', createIdea);
router.put('/:id', updateIdea);
router.delete('/:id', deleteIdea);

// Sync route for guest data migration
router.post('/sync', bulkCreateIdeas);

export default router;
