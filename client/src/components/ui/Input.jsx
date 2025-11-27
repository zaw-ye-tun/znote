import { cn } from '../../lib/utils';

/**
 * Input Component
 * 
 * Reusable text input with consistent styling.
 * 
 * Props:
 * - className: Additional CSS classes
 * - ...props: All input props (type, value, onChange, placeholder, etc.)
 */

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600',
        'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
        'placeholder:text-gray-400 dark:placeholder:text-gray-500',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}
