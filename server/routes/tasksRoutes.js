import express from 'express';
import { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask,
  bulkCreateTasks 
} from '../controllers/tasksController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

/**
 * Tasks Routes
 * 
 * All routes require authentication (authMiddleware)
 * 
 * GET /api/tasks - Get all tasks for current user
 * GET /api/tasks/:id - Get specific task by ID
 * POST /api/tasks - Create a new task
 * PUT /api/tasks/:id - Update existing task
 * DELETE /api/tasks/:id - Delete a task
 * POST /api/tasks/sync - Bulk create tasks (for syncing guest data)
 */

// All routes are protected
router.use(authMiddleware);

// CRUD routes
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Sync route for guest data migration
router.post('/sync', bulkCreateTasks);

export default router;
