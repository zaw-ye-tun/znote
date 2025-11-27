import { Trash2, Edit, Tag } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDateTime, truncate } from '../../lib/utils';

/**
 * Idea Card Component
 * 
 * Displays a single idea with:
 * - Title and description preview
 * - Category badge
 * - Tags
 * - Edit and delete actions
 * - Timestamp
 * 
 * Props:
 * - idea: Idea object {id, title, description, category, tags, createdAt}
 * - onEdit: Function to handle edit action
 * - onDelete: Function to handle delete action
 */

export function IdeaCard({ idea, onEdit, onDelete }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
          {idea.title}
        </h3>
        
        {/* Category Badge */}
        {idea.category && (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 flex-shrink-0 ml-2">
            {idea.category}
          </span>
        )}
      </div>
      
      {/* Description preview */}
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
        {truncate(idea.description, 200)}
      </p>
      
      {/* Tags */}
      {idea.tags && idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {idea.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Timestamp */}
      <div className="text-xs text-gray-400 dark:text-gray-500 mb-3">
        {formatDateTime(idea.createdAt)}
      </div>
      
      {/* Actions */}
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(idea)}
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(idea.id)}
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </Card>
  );
}
