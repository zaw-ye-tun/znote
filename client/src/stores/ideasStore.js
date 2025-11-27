import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import { generateId } from '../lib/utils';

/**
 * Ideas Store (Zustand)
 * 
 * Manages ideas for both GUEST and AUTHENTICATED modes.
 * Similar pattern to Notes and Tasks stores.
 * 
 * State:
 * - ideas: Array of idea objects
 * - loading: Boolean loading state
 * - error: Error message if any
 */

export const useIdeasStore = create(
  persist(
    (set, get) => ({
      // State
      ideas: [],
      loading: false,
      error: null,
      
      /**
       * Fetch all ideas
       */
      fetchIdeas: async (isAuthenticated, category = null) => {
        if (!isAuthenticated) {
          // Guest mode: ideas are already in state
          return;
        }
        
        // Authenticated mode: fetch from server
        set({ loading: true, error: null });
        
        try {
          const url = category ? `/ideas?category=${category}` : '/ideas';
          const response = await api.get(url);
          set({ ideas: response.data.ideas, loading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Failed to fetch ideas',
            loading: false 
          });
        }
      },
      
      /**
       * Add a new idea
       */
      addIdea: async (ideaData, isAuthenticated) => {
        if (!isAuthenticated) {
          // Guest mode: add to local state
          const newIdea = {
            id: generateId(),
            ...ideaData,
            tags: ideaData.tags || [],
            category: ideaData.category || 'general',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          set((state) => ({
            ideas: [newIdea, ...state.ideas]
          }));
          
          return { success: true, idea: newIdea };
        }
        
        // Authenticated mode: save to server
        set({ loading: true, error: null });
        
        try {
          const response = await api.post('/ideas', ideaData);
          const newIdea = response.data.idea;
          
          set((state) => ({
            ideas: [newIdea, ...state.ideas],
            loading: false
          }));
          
          return { success: true, idea: newIdea };
        } catch (error) {
          const message = error.response?.data?.error || 'Failed to create idea';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
      
      /**
       * Update an existing idea
       */
      updateIdea: async (id, updates, isAuthenticated) => {
        if (!isAuthenticated) {
          // Guest mode: update in local state
          set((state) => ({
            ideas: state.ideas.map((idea) =>
              idea.id === id
                ? { ...idea, ...updates, updatedAt: new Date().toISOString() }
                : idea
            )
          }));
          
          return { success: true };
        }
        
        // Authenticated mode: update on server
        set({ loading: true, error: null });
        
        try {
          const response = await api.put(`/ideas/${id}`, updates);
          const updatedIdea = response.data.idea;
          
          set((state) => ({
            ideas: state.ideas.map((idea) =>
              idea.id === id ? updatedIdea : idea
            ),
            loading: false
          }));
          
          return { success: true, idea: updatedIdea };
        } catch (error) {
          const message = error.response?.data?.error || 'Failed to update idea';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
      
      /**
       * Delete an idea
       */
      deleteIdea: async (id, isAuthenticated) => {
        if (!isAuthenticated) {
          // Guest mode: remove from local state
          set((state) => ({
            ideas: state.ideas.filter((idea) => idea.id !== id)
          }));
          
          return { success: true };
        }
        
        // Authenticated mode: delete from server
        set({ loading: true, error: null });
        
        try {
          await api.delete(`/ideas/${id}`);
          
          set((state) => ({
            ideas: state.ideas.filter((idea) => idea.id !== id),
            loading: false
          }));
          
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.error || 'Failed to delete idea';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
      
      /**
       * Search ideas (authenticated mode only)
       */
      searchIdeas: async (query) => {
        set({ loading: true, error: null });
        
        try {
          const response = await api.get(`/ideas/search?query=${query}`);
          set({ ideas: response.data.ideas, loading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Failed to search ideas',
            loading: false 
          });
        }
      },
      
      /**
       * Clear all ideas
       */
      clearIdeas: () => {
        set({ ideas: [] });
      },
      
      /**
       * Get ideas for sync (guest mode only)
       */
      getIdeasForSync: () => {
        const { ideas } = get();
        return ideas.map(({ id, ...idea }) => idea);
      }
    }),
    {
      name: 'znote-ideas', // localStorage key
      partialize: (state) => ({
        ideas: state.ideas
      })
    }
  )
);
