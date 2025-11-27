import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Ideas Controller
 * 
 * Handles all CRUD operations for ideas in the "Idea Vault".
 * All operations are scoped to the authenticated user (req.userId).
 */

/**
 * Get all ideas for the current user
 * 
 * Returns ideas sorted by creation date (newest first)
 * Supports filtering by category via query params
 */
export const getIdeas = async (req, res) => {
  try {
    const { category } = req.query;

    // Build where clause
    const where = { userId: req.userId };
    if (category) {
      where.category = category;
    }

    const ideas = await prisma.idea.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({ ideas });
  } catch (error) {
    console.error('Get ideas error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch ideas' 
    });
  }
};

/**
 * Get a single idea by ID
 * 
 * Ensures the idea belongs to the authenticated user
 */
export const getIdeaById = async (req, res) => {
  try {
    const { id } = req.params;

    const idea = await prisma.idea.findFirst({
      where: { 
        id,
        userId: req.userId // Security: ensure user owns this idea
      }
    });

    if (!idea) {
      return res.status(404).json({ 
        error: 'Idea not found' 
      });
    }

    res.json({ idea });
  } catch (error) {
    console.error('Get idea error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch idea' 
    });
  }
};

/**
 * Create a new idea
 * 
 * Required: title, description
 * Optional: category, tags (array of strings)
 */
export const createIdea = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ 
        error: 'Title and description are required' 
      });
    }

    // Create idea linked to the authenticated user
    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        category: category || 'general',
        tags: Array.isArray(tags) ? tags : [],
        userId: req.userId
      }
    });

    res.status(201).json({ 
      message: 'Idea created successfully',
      idea 
    });
  } catch (error) {
    console.error('Create idea error:', error);
    res.status(500).json({ 
      error: 'Failed to create idea' 
    });
  }
};

/**
 * Update an existing idea
 * 
 * Can update any field: title, description, category, tags
 * Only updates fields that are provided in the request
 */
export const updateIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, tags } = req.body;

    // Check if idea exists and belongs to user
    const existingIdea = await prisma.idea.findFirst({
      where: { 
        id,
        userId: req.userId 
      }
    });

    if (!existingIdea) {
      return res.status(404).json({ 
        error: 'Idea not found' 
      });
    }

    // Update only provided fields
    const idea = await prisma.idea.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [] })
      }
    });

    res.json({ 
      message: 'Idea updated successfully',
      idea 
    });
  } catch (error) {
    console.error('Update idea error:', error);
    res.status(500).json({ 
      error: 'Failed to update idea' 
    });
  }
};

/**
 * Delete an idea
 * 
 * Permanently removes the idea from database
 */
export const deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if idea exists and belongs to user
    const existingIdea = await prisma.idea.findFirst({
      where: { 
        id,
        userId: req.userId 
      }
    });

    if (!existingIdea) {
      return res.status(404).json({ 
        error: 'Idea not found' 
      });
    }

    // Delete the idea
    await prisma.idea.delete({
      where: { id }
    });

    res.json({ 
      message: 'Idea deleted successfully' 
    });
  } catch (error) {
    console.error('Delete idea error:', error);
    res.status(500).json({ 
      error: 'Failed to delete idea' 
    });
  }
};

/**
 * Bulk create ideas
 * 
 * Used when syncing guest data to authenticated user account
 * Accepts an array of ideas and creates them all at once
 */
export const bulkCreateIdeas = async (req, res) => {
  try {
    const { ideas } = req.body;

    // Validate input
    if (!Array.isArray(ideas) || ideas.length === 0) {
      return res.status(400).json({ 
        error: 'Ideas array is required' 
      });
    }

    // Add userId to each idea
    const ideasWithUserId = ideas.map(idea => ({
      title: idea.title,
      description: idea.description,
      category: idea.category || 'general',
      tags: Array.isArray(idea.tags) ? idea.tags : [],
      userId: req.userId
    }));

    // Create all ideas in a single transaction
    const createdIdeas = await prisma.idea.createMany({
      data: ideasWithUserId,
      skipDuplicates: true // Skip if duplicate IDs exist
    });

    res.status(201).json({ 
      message: `${createdIdeas.count} ideas synced successfully`,
      count: createdIdeas.count
    });
  } catch (error) {
    console.error('Bulk create ideas error:', error);
    res.status(500).json({ 
      error: 'Failed to sync ideas' 
    });
  }
};

/**
 * Search ideas by tags or text
 * 
 * Searches in title, description, and tags
 */
export const searchIdeas = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ 
        error: 'Search query is required' 
      });
    }

    // Search in title, description, and tags
    const ideas = await prisma.idea.findMany({
      where: {
        userId: req.userId,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ ideas });
  } catch (error) {
    console.error('Search ideas error:', error);
    res.status(500).json({ 
      error: 'Failed to search ideas' 
    });
  }
};
