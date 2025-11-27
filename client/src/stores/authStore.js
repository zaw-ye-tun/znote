import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

/**
 * Auth Store (Zustand)
 * 
 * Manages authentication state and user information.
 * Persists to localStorage to maintain login across page refreshes.
 * 
 * State:
 * - user: Current user object (null if not authenticated)
 * - token: JWT token (null if not authenticated)
 * - isAuthenticated: Boolean flag
 * - isGuest: Boolean flag (true if using app without account)
 * 
 * Actions:
 * - login: Authenticate user and store token
 * - register: Create new user account
 * - logout: Clear auth state
 * - updateUser: Update user profile
 */

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isGuest: true,
      
      /**
       * Register new user
       * Creates account and syncs guest data to server
       */
      register: async (email, password, name, guestData) => {
        try {
          // Step 1: Register the user
          const response = await api.post('/auth/register', {
            email,
            password,
            name
          });
          
          const { user, token } = response.data;
          
          // Step 2: Store auth data
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isGuest: false 
          });
          
          // Also store token separately for API interceptor
          localStorage.setItem('znote_token', token);
          
          // Step 3: Sync guest data if provided
          if (guestData) {
            const { notes, tasks, ideas } = guestData;
            
            // Sync notes
            if (notes && notes.length > 0) {
              await api.post('/notes/sync', { notes });
            }
            
            // Sync tasks
            if (tasks && tasks.length > 0) {
              await api.post('/tasks/sync', { tasks });
            }
            
            // Sync ideas
            if (ideas && ideas.length > 0) {
              await api.post('/ideas/sync', { ideas });
            }
          }
          
          return { success: true, user };
        } catch (error) {
          const message = error.response?.data?.error || 'Registration failed';
          return { success: false, error: message };
        }
      },
      
      /**
       * Login existing user
       */
      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', {
            email,
            password
          });
          
          const { user, token } = response.data;
          
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isGuest: false 
          });
          
          // Store token for API interceptor
          localStorage.setItem('znote_token', token);
          
          return { success: true, user };
        } catch (error) {
          const message = error.response?.data?.error || 'Login failed';
          return { success: false, error: message };
        }
      },
      
      /**
       * Logout user
       * Clears all auth state and local storage
       */
      logout: () => {
        // Clear auth state
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          isGuest: true 
        });
        
        // Clear localStorage
        localStorage.removeItem('znote_token');
        localStorage.removeItem('znote_user');
      },
      
      /**
       * Get current user profile
       * Useful for refreshing user data
       */
      getProfile: async () => {
        try {
          const response = await api.get('/auth/profile');
          const { user } = response.data;
          
          set({ user });
          return { success: true, user };
        } catch (error) {
          return { success: false, error: 'Failed to fetch profile' };
        }
      },
      
      /**
       * Update user in state
       */
      updateUser: (user) => {
        set({ user });
      },
      
      /**
       * Switch from guest to authenticated mode
       * Used internally after registration/login
       */
      setAuthenticated: (user, token) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isGuest: false 
        });
        localStorage.setItem('znote_token', token);
      }
    }),
    {
      name: 'znote-auth', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest
      })
    }
  )
);
