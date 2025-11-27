import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Theme Store (Zustand)
 * 
 * Manages dark/light mode theme preference.
 * Persists to localStorage and applies theme class to document.
 * 
 * State:
 * - theme: 'light' | 'dark'
 * 
 * Actions:
 * - toggleTheme: Switch between light and dark
 * - setTheme: Set specific theme
 */

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // State - default to light theme
      theme: 'light',
      
      /**
       * Toggle between light and dark theme
       */
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        
        // Apply theme to document
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      /**
       * Set specific theme
       */
      setTheme: (theme) => {
        set({ theme });
        
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      /**
       * Initialize theme (call on app start)
       */
      initTheme: () => {
        const { theme } = get();
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }),
    {
      name: 'znote-theme', // localStorage key
      partialize: (state) => ({
        theme: state.theme
      })
    }
  )
);
