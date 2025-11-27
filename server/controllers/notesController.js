import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Notes Controller
 * 
 * Handles all CRUD operations for notes.
 * All operations are scoped to the authenticated user (req.userId).
 */

/**
 * Get all notes for the current user
 * 
 * Returns notes sorted by: pinned first, then by creation date (newest first)
 */
export const getNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.userId },
      orderBy: [
        { isPinned: 'desc' }, // Pinned notes first
        { createdAt: 'desc' } // Then by newest
      ]
    });

    res.json({ notes });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch notes' 
    });
  }
};

/**
 * Get a single note by ID
 * 
 * Ensures the note belongs to the authenticated user
 */
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findFirst({
      where: { 
        id,
        userId: req.userId // Security: ensure user owns this note
      }
    });

    if (!note) {
      return res.status(404).json({ 
        error: 'Note not found' 
      });
    }

    res.json({ note });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch note' 
    });
  }
};

/**
 * Create a new note
 * 
 * Required: title, content
 * Optional: color, isPinned
 */
export const createNote = async (req, res) => {
  try {
    const { title, content, color, isPinned } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ 
        error: 'Title and content are required' 
      });
    }

    // Create note linked to the authenticated user
    const note = await prisma.note.create({
      data: {
        title,
        content,
        color: color || '#ffffff',
        isPinned: isPinned || false,
        userId: req.userId
      }
    });

    res.status(201).json({ 
      message: 'Note created successfully',
      note 
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ 
      error: 'Failed to create note' 
    });
  }
};

/**
 * Update an existing note
 * 
 * Can update any field: title, content, color, isPinned
 * Only updates fields that are provided in the request
 */
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, color, isPinned } = req.body;

    // Check if note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: { 
        id,
        userId: req.userId 
      }
    });

    if (!existingNote) {
      return res.status(404).json({ 
        error: 'Note not found' 
      });
    }

    // Update only provided fields
    const note = await prisma.note.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(color !== undefined && { color }),
        ...(isPinned !== undefined && { isPinned })
      }
    });

    res.json({ 
      message: 'Note updated successfully',
      note 
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ 
      error: 'Failed to update note' 
    });
  }
};

/**
 * Delete a note
 * 
 * Permanently removes the note from database
 */
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: { 
        id,
        userId: req.userId 
      }
    });

    if (!existingNote) {
      return res.status(404).json({ 
        error: 'Note not found' 
      });
    }

    // Delete the note
    await prisma.note.delete({
      where: { id }
    });

    res.json({ 
      message: 'Note deleted successfully' 
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ 
      error: 'Failed to delete note' 
    });
  }
};

/**
 * Bulk create notes
 * 
 * Used when syncing guest data to authenticated user account
 * Accepts an array of notes and creates them all at once
 */
export const bulkCreateNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    // Validate input
    if (!Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({ 
        error: 'Notes array is required' 
      });
    }

    // Add userId to each note
    const notesWithUserId = notes.map(note => ({
      title: note.title,
      content: note.content,
      color: note.color || '#ffffff',
      isPinned: note.isPinned || false,
      userId: req.userId
    }));

    // Create all notes in a single transaction
    const createdNotes = await prisma.note.createMany({
      data: notesWithUserId,
      skipDuplicates: true // Skip if duplicate IDs exist
    });

    res.status(201).json({ 
      message: `${createdNotes.count} notes synced successfully`,
      count: createdNotes.count
    });
  } catch (error) {
    console.error('Bulk create notes error:', error);
    res.status(500).json({ 
      error: 'Failed to sync notes' 
    });
  }
};
