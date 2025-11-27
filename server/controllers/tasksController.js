import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Tasks Controller
 * 
 * Handles all CRUD operations for tasks/todos.
 * All operations are scoped to the authenticated user (req.userId).
 */

/**
 * Get all tasks for the current user
 * 
 * Returns tasks sorted by: incomplete first, then by due date
 */
export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: [
        { completed: 'asc' },  // Incomplete tasks first
        { dueDate: 'asc' },    // Then by due date
        { createdAt: 'desc' }  // Then by newest
      ]
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tasks' 
    });
  }
};

/**
 * Get a single task by ID
 * 
 * Ensures the task belongs to the authenticated user
 */
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: { 
        id,
        userId: req.userId // Security: ensure user owns this task
      }
    });

    if (!task) {
      return res.status(404).json({ 
        error: 'Task not found' 
      });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch task' 
    });
  }
};

/**
 * Create a new task
 * 
 * Required: title
 * Optional: description, completed, priority, dueDate
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ 
        error: 'Title is required' 
      });
    }

    // Create task linked to the authenticated user
    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        completed: completed || false,
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.userId
      }
    });

    res.status(201).json({ 
      message: 'Task created successfully',
      task 
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ 
      error: 'Failed to create task' 
    });
  }
};

/**
 * Update an existing task
 * 
 * Can update any field: title, description, completed, priority, dueDate
 * Only updates fields that are provided in the request
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, dueDate } = req.body;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { 
        id,
        userId: req.userId 
      }
    });

    if (!existingTask) {
      return res.status(404).json({ 
        error: 'Task not found' 
      });
    }

    // Update only provided fields
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null })
      }
    });

    res.json({ 
      message: 'Task updated successfully',
      task 
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      error: 'Failed to update task' 
    });
  }
};

/**
 * Delete a task
 * 
 * Permanently removes the task from database
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { 
        id,
        userId: req.userId 
      }
    });

    if (!existingTask) {
      return res.status(404).json({ 
        error: 'Task not found' 
      });
    }

    // Delete the task
    await prisma.task.delete({
      where: { id }
    });

    res.json({ 
      message: 'Task deleted successfully' 
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      error: 'Failed to delete task' 
    });
  }
};

/**
 * Bulk create tasks
 * 
 * Used when syncing guest data to authenticated user account
 * Accepts an array of tasks and creates them all at once
 */
export const bulkCreateTasks = async (req, res) => {
  try {
    const { tasks } = req.body;

    // Validate input
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ 
        error: 'Tasks array is required' 
      });
    }

    // Add userId to each task
    const tasksWithUserId = tasks.map(task => ({
      title: task.title,
      description: task.description || null,
      completed: task.completed || false,
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      userId: req.userId
    }));

    // Create all tasks in a single transaction
    const createdTasks = await prisma.task.createMany({
      data: tasksWithUserId,
      skipDuplicates: true // Skip if duplicate IDs exist
    });

    res.status(201).json({ 
      message: `${createdTasks.count} tasks synced successfully`,
      count: createdTasks.count
    });
  } catch (error) {
    console.error('Bulk create tasks error:', error);
    res.status(500).json({ 
      error: 'Failed to sync tasks' 
    });
  }
};
