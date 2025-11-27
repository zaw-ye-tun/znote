import { cn } from '../../lib/utils';

/**
 * Textarea Component
 * 
 * Reusable textarea with consistent styling.
 * 
 * Props:
 * - className: Additional CSS classes
 * - ...props: All textarea props (value, onChange, placeholder, rows, etc.)
 */

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600',
        'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
        'placeholder:text-gray-400 dark:placeholder:text-gray-500',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'resize-none',
        className
      )}
      {...props}
    />
  );
}
