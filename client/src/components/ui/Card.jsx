import { cn } from '../../lib/utils';

/**
 * Card Component
 * 
 * Container with shadow and border for content grouping.
 * 
 * Props:
 * - className: Additional CSS classes
 * - children: Card content
 * - ...props: All div props
 */

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-lg shadow-md',
        'border border-gray-200 dark:border-gray-700',
        'p-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
