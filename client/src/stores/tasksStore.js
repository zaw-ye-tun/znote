import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import { generateId } from '../lib/utils';

/**
 * Tasks Store (Zustand)
 * 
 * Manages tasks for both GUEST and AUTHENTICATED modes.
 * Similar pattern to Notes Store.
 * 
 * State:
 * - tasks: Array of task objects
 * - loading: Boolean loading state
 * - error: Error message if any
 */

export const useTasksStore = create(
  persist(
    (set, get) => ({
      // State
      tasks: [],
      loading: false,
      error: null,
      
      /**
       * Fetch all tasks
       */
      fetchTasks: async (isAuthenticated) => {
        if (!isAuthenticated) {
          // Guest mode: tasks are already in state
          return;
        }
        
        // Authenticated mode: fetch from server
        set({ loading: true, error: null });
        
        try {
          const response = await api.get('/tasks');
          set({ tasks: response.data.tasks, loading: false });
        } catch (error) {
          set({ 
            error: error.response?.data?.error || 'Failed to fetch tasks',
            loading: false 
          });
        }
      },
      
      /**
       * Add a new task
       */
      addTask: async (taskData, isAuthenticated) => {
        if (!isAuthenticated) {
          // Guest mode: add to local state
          const newTask = {
            id: generateId(),
            ...taskData,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          set((state) => ({
            tasks: [newTask, ...state.tasks]
          }));
          
          return { success: true, task: newTask };
        }
        
        // Authenticated mode: save to server
        set({ loading: true, error: null });
        
        try {
          const response = await api.post('/tasks', taskData);
          const newTask = response.data.task;
          
          set((state) => ({
            tasks: [newTask, ...state.tasks],
            loading: false
          }));
          
          return { success: true, task: newTask };
        } catch (error) {
          const message = error.response?.data?.error || 'Failed to create task';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
      
      /**
       * Update an existing task
       */
      updateTask: async (id, updates, isAuthenticated) => {
        if (!isAuthenticated) {
          // Guest mode: update in local state
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id
                ? { ...task, ...updates, updatedAt: new Date().toISOString() }
                : task
            )
          }));
          
          return { success: true };
        }
        
        // Authenticated mode: update on server
        set({ loading: true, error: null });
        
        try {
          const response = await api.put(`/tasks/${id}`, updates);
          const updatedTask = response.data.task;
          
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? updatedTask : task
            ),
            loading: false
          }));
          
          return { success: true, task: updatedTask };
        } catch (error) {
          const message = error.response?.data?.error || 'Failed to update task';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
      
      /**
       * Toggle task completion
       */
      toggleTask: async (id, isAuthenticated) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return { success: false, error: 'Task not found' };
        
        return get().updateTask(id, { completed: !task.completed }, isAuthenticated);
      },
      
      /**
       * Delete a task
       */
      deleteTask: async (id, isAuthenticated) => {
        if (!isAuthenticated) {
          // Guest mode: remove from local state
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id)
          }));
          
          return { success: true };
        }
        
        // Authenticated mode: delete from server
        set({ loading: true, error: null });
        
        try {
          await api.delete(`/tasks/${id}`);
          
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
            loading: false
          }));
          
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.error || 'Failed to delete task';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
      
      /**
       * Clear all tasks
       */
      clearTasks: () => {
        set({ tasks: [] });
      },
      
      /**
       * Get tasks for sync (guest mode only)
       */
      getTasksForSync: () => {
        const { tasks } = get();
        return tasks.map(({ id, ...task }) => task);
      }
    }),
    {
      name: 'znote-tasks', // localStorage key
      partialize: (state) => ({
        tasks: state.tasks
      })
    }
  )
);
