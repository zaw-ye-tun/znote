import { Trash2, Edit, Pin } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDateTime, truncate } from '../../lib/utils';
import { cn } from '../../lib/utils';

/**
 * Note Card Component
 * 
 * Displays a single note with:
 * - Title and content preview
 * - Color indicator
 * - Pin status
 * - Edit and delete actions
 * - Timestamp
 * 
 * Props:
 * - note: Note object {id, title, content, color, isPinned, createdAt}
 * - onEdit: Function to handle edit action
 * - onDelete: Function to handle delete action
 * - onTogglePin: Function to toggle pin status
 */

export function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  return (
    <Card 
      className={cn(
        'group hover:shadow-lg transition-shadow cursor-pointer',
        'border-l-4'
      )}
      style={{ borderLeftColor: note.color || '#3b82f6' }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
          {note.title}
        </h3>
        
        {/* Pin indicator */}
        {note.isPinned && (
          <Pin className="w-4 h-4 text-primary-600 fill-current flex-shrink-0" />
        )}
      </div>
      
      {/* Content preview */}
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
        {truncate(note.content, 150)}
      </p>
      
      {/* Timestamp */}
      <div className="text-xs text-gray-400 dark:text-gray-500 mb-3">
        {formatDateTime(note.createdAt)}
      </div>
      
      {/* Actions */}
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTogglePin(note.id)}
          title={note.isPinned ? 'Unpin' : 'Pin'}
        >
          <Pin className={cn(
            'w-4 h-4',
            note.isPinned && 'fill-current'
          )} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(note)}
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(note.id)}
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </Card>
  );
}
