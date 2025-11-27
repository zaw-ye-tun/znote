import { Trash2, Edit, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDate } from '../../lib/utils';
import { cn } from '../../lib/utils';

/**
 * Task Card Component
 * 
 * Displays a single task with:
 * - Checkbox for completion
 * - Title and description
 * - Priority indicator
 * - Due date
 * - Edit and delete actions
 * 
 * Props:
 * - task: Task object {id, title, description, completed, priority, dueDate}
 * - onToggle: Function to toggle completion
 * - onEdit: Function to handle edit action
 * - onDelete: Function to handle delete action
 */

export function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  
  return (
    <Card className={cn(
      'group hover:shadow-lg transition-all',
      task.completed && 'opacity-60'
    )}>
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
        />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className={cn(
              'text-base font-semibold text-gray-900 dark:text-white',
              task.completed && 'line-through text-gray-500'
            )}>
              {task.title}
            </h3>
            
            {/* Priority Badge */}
            {task.priority && (
              <span className={cn(
                'px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ml-2',
                priorityColors[task.priority]
              )}>
                {task.priority}
              </span>
            )}
          </div>
          
          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {task.description}
            </p>
          )}
          
          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(task.dueDate)}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
