import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useNotesStore } from '../stores/notesStore';
import { NoteCard } from '../components/notes/NoteCard';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';

/**
 * Notes Page
 * 
 * Main page for managing notes.
 * Features:
 * - Display all notes in a grid
 * - Add new notes
 * - Edit existing notes
 * - Delete notes
 * - Toggle pin status
 * - Search notes
 */

export function NotesPage() {
  const { isAuthenticated } = useAuthStore();
  const { notes, fetchNotes, addNote, updateNote, deleteNote } = useNotesStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    color: '#3b82f6',
    isPinned: false
  });
  
  // Fetch notes on mount if authenticated
  useEffect(() => {
    fetchNotes(isAuthenticated);
  }, [isAuthenticated, fetchNotes]);
  
  // Filter notes based on search query
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Open modal for new note
  const handleAddNew = () => {
    setEditingNote(null);
    setFormData({
      title: '',
      content: '',
      color: '#3b82f6',
      isPinned: false
    });
    setIsModalOpen(true);
  };
  
  // Open modal for editing
  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      color: note.color || '#3b82f6',
      isPinned: note.isPinned || false
    });
    setIsModalOpen(true);
  };
  
  // Save note (create or update)
  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      alert('Please fill in title and content');
      return;
    }
    
    if (editingNote) {
      // Update existing note
      await updateNote(editingNote.id, formData, isAuthenticated);
    } else {
      // Create new note
      await addNote(formData, isAuthenticated);
    }
    
    setIsModalOpen(false);
    setFormData({ title: '', content: '', color: '#3b82f6', isPinned: false });
  };
  
  // Delete note with confirmation
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id, isAuthenticated);
    }
  };
  
  // Toggle pin status
  const handleTogglePin = async (id) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      await updateNote(id, { isPinned: !note.isPinned }, isAuthenticated);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </p>
        </div>
        
        <Button onClick={handleAddNew} className="mt-4 sm:mt-0">
          <Plus className="w-5 h-5 mr-2" />
          New Note
        </Button>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
          </p>
        </div>
      )}
      
      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNote ? 'Edit Note' : 'New Note'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <Input
              type="text"
              placeholder="Note title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content
            </label>
            <Textarea
              placeholder="Write your note..."
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color
            </label>
            <div className="flex space-x-2">
              {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? 'border-gray-900 dark:border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="pin"
              checked={formData.isPinned}
              onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="pin" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Pin this note
            </label>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              {editingNote ? 'Update' : 'Create'}
            </Button>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
