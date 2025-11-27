import express from 'express';
import { 
  getNotes, 
  getNoteById, 
  createNote, 
  updateNote, 
  deleteNote,
  bulkCreateNotes 
} from '../controllers/notesController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Notes Routes
 * 
 * All routes require authentication (authMiddleware)
 * 
 * GET /api/notes - Get all notes for current user
 * GET /api/notes/:id - Get specific note by ID
 * POST /api/notes - Create a new note
 * PUT /api/notes/:id - Update existing note
 * DELETE /api/notes/:id - Delete a note
 * POST /api/notes/sync - Bulk create notes (for syncing guest data)
 */

// All routes are protected
router.use(authMiddleware);

// CRUD routes
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

// Sync route for guest data migration
router.post('/sync', bulkCreateNotes);

export default router;
