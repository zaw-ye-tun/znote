import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import { generateId } from '../lib/utils';

/**
 * Notes Store (Zustand)
 * 
 * Manages notes for both GUEST and AUTHENTICATED modes.
 * 
 * GUEST MODE: Notes stored in localStorage
 * AUTHENTICATED MODE: Notes stored in database via API
 * 
 * State:
 * - notes: Array of note objects
 * - loading: Boolean loading state
 * - error: Error message if any
 * 
 * Actions:
 * - fetchNotes: Get all notes (from API if authenticated)
 * - addNote: Create a new note
 * - updateNote: Update existing note
 * - deleteNote: Delete a note
 * - clearNotes: Clear all notes (used after sync)
 */

export const useNotesStore = create(
  persist(
    (set, get) => ({
      // State
      notes: [],
      loading: false,
      error: null,
      
      /**
       * Fetch all notes
       * If authenticated: fetch from API
       * If guest: return local notes from state
       */
      fetchNotes: async (isAuthenticated) => {
        if (!isAuthenticated) {
          // Guest mode: notes are already in state from localStorage
          return;
        }
        
        // Authenticated mode: fetch from server
        set({ loading: true, error: null });
        
        try {
          const response = await api.get('/notes');
          set({ notes: response.data.notes, loading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Failed to fetch notes',
            loading: false 
          });
        }
      },
      
      /**
       * Add a new note
       */
      addNote: async (noteData, isAuthenticated) => {
        if (!isAuthenticated) {
          // Guest mode: add to local state
          const newNote = {
            id: generateId(),
            ...noteData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          set((state) => ({
            notes: [newNote, ...state.notes]
          }));
          
          return { success: true, note: newNote };
        }
        
        // Authenticated mode: save to server
        set({ loading: true, error: null });
        
        try {
          const response = await api.post('/notes', noteData);
          const newNote = response.data.note;
          
          set((state) => ({
            notes: [newNote, ...state.notes],
            loading: false
          }));
          
          return { success: true, note: newNote };
        } catch (error) {
          const message = error.response?.data?.error || 'Failed to create note';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
      
      /**
       * Update an existing note
       */
      updateNote: async (id, updates, isAuthenticated) => {
        if (!isAuthenticated) {
          // Guest mode: update in local state
          set((state) => ({
            notes: state.notes.map((note) =>
              note.id === id
                ? { ...note, ...updates, updatedAt: new Date().toISOString() }
                : note
            )
          }));
          
          return { success: true };
        }
        
        // Authenticated mode: update on server
        set({ loading: true, error: null });
        
        try {
          const response = await api.put(`/notes/${id}`, updates);
          const updatedNote = response.data.note;
          
          set((state) => ({
            notes: state.notes.map((note) =>
              note.id === id ? updatedNote : note
            ),
            loading: false
          }));
          
          return { success: true, note: updatedNote };
        } catch (error) {
          const message = error.response?.data?.error || 'Failed to update note';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
      
      /**
       * Delete a note
       */
      deleteNote: async (id, isAuthenticated) => {
        if (!isAuthenticated) {
          // Guest mode: remove from local state
          set((state) => ({
            notes: state.notes.filter((note) => note.id !== id)
          }));
          
          return { success: true };
        }
        
        // Authenticated mode: delete from server
        set({ loading: true, error: null });
        
        try {
          await api.delete(`/notes/${id}`);
          
          set((state) => ({
            notes: state.notes.filter((note) => note.id !== id),
            loading: false
          }));
          
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.error || 'Failed to delete note';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
      
      /**
       * Clear all notes
       * Used after syncing guest data to server
       */
      clearNotes: () => {
        set({ notes: [] });
      },
      
      /**
       * Get notes for sync (guest mode only)
       * Returns notes without local IDs for server creation
       */
      getNotesForSync: () => {
        const { notes } = get();
        return notes.map(({ id, ...note }) => note);
      }
    }),
    {
      name: 'znote-notes', // localStorage key (only used in guest mode)
      partialize: (state) => ({
        notes: state.notes
      })
    }
  )
);
