import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility Functions
 */

/**
 * Merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for better class handling
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 * Example: "Dec 25, 2023"
 */
export function formatDate(date) {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format date with time
 * Example: "Dec 25, 2023 at 3:45 PM"
 */
export function formatDateTime(date) {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

/**
 * Generate a unique ID (for guest mode)
 * Uses timestamp + random number
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Truncate text to specified length
 */
export function truncate(text, length = 100) {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Debounce function
 * Delays execution until after specified wait time
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
