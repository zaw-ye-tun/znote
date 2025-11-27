import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useIdeasStore } from '../stores/ideasStore';
import { IdeaCard } from '../components/ideas/IdeaCard';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';

/**
 * Ideas Page
 * 
 * Main page for the "Idea Vault".
 * Features:
 * - Display all ideas
 * - Add new ideas
 * - Edit existing ideas
 * - Delete ideas
 * - Filter by category
 * - Search ideas
 * - Add tags
 */

export function IdeasPage() {
  const { isAuthenticated } = useAuthStore();
  const { ideas, fetchIdeas, addIdea, updateIdea, deleteIdea } = useIdeasStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    tags: ''
  });
  
  // Fetch ideas on mount if authenticated
  useEffect(() => {
    fetchIdeas(isAuthenticated);
  }, [isAuthenticated, fetchIdeas]);
  
  // Get unique categories from ideas
  const categories = ['all', ...new Set(ideas.map(idea => idea.category))];
  
  // Filter and search ideas
  const filteredIdeas = ideas.filter(idea => {
    // Category filter
    if (selectedCategory !== 'all' && idea.category !== selectedCategory) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      return (
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return true;
  });
  
  // Open modal for new idea
  const handleAddNew = () => {
    setEditingIdea(null);
    setFormData({
      title: '',
      description: '',
      category: 'general',
      tags: ''
    });
    setIsModalOpen(true);
  };
  
  // Open modal for editing
  const handleEdit = (idea) => {
    setEditingIdea(idea);
    setFormData({
      title: idea.title,
      description: idea.description,
      category: idea.category || 'general',
      tags: idea.tags ? idea.tags.join(', ') : ''
    });
    setIsModalOpen(true);
  };
  
  // Save idea (create or update)
  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in title and description');
      return;
    }
    
    // Parse tags from comma-separated string
    const tagsArray = formData.tags
      ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      : [];
    
    const ideaData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: tagsArray
    };
    
    if (editingIdea) {
      // Update existing idea
      await updateIdea(editingIdea.id, ideaData, isAuthenticated);
    } else {
      // Create new idea
      await addIdea(ideaData, isAuthenticated);
    }
    
    setIsModalOpen(false);
    setFormData({ title: '', description: '', category: 'general', tags: '' });
  };
  
  // Delete idea with confirmation
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      await deleteIdea(id, isAuthenticated);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Idea Vault
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {ideas.length} {ideas.length === 1 ? 'idea' : 'ideas'}
          </p>
        </div>
        
        <Button onClick={handleAddNew} className="mt-4 sm:mt-0">
          <Plus className="w-5 h-5 mr-2" />
          New Idea
        </Button>
      </div>
      
      {/* Search and Category Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      {/* Ideas Grid */}
      {filteredIdeas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery 
              ? 'No ideas found matching your search.' 
              : selectedCategory !== 'all'
              ? `No ideas in the "${selectedCategory}" category.`
              : 'No ideas yet. Capture your first brilliant idea!'}
          </p>
        </div>
      )}
      
      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIdea ? 'Edit Idea' : 'New Idea'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <Input
              type="text"
              placeholder="Idea title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <Textarea
              placeholder="Describe your idea..."
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <Input
              type="text"
              placeholder="e.g., business, creative, tech..."
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags (comma-separated)
            </label>
            <Input
              type="text"
              placeholder="tag1, tag2, tag3..."
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              {editingIdea ? 'Update' : 'Create'}
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
