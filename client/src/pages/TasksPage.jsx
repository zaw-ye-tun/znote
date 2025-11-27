import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useTasksStore } from '../stores/tasksStore';
import { TaskCard } from '../components/tasks/TaskCard';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';

/**
 * Tasks Page
 * 
 * Main page for managing tasks/todos.
 * Features:
 * - Display all tasks
 * - Add new tasks
 * - Edit existing tasks
 * - Delete tasks
 * - Toggle completion
 * - Filter by completion status
 * - Search tasks
 */

export function TasksPage() {
  const { isAuthenticated } = useAuthStore();
  const { tasks, fetchTasks, addTask, updateTask, deleteTask, toggleTask } = useTasksStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'completed'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });
  
  // Fetch tasks on mount if authenticated
  useEffect(() => {
    fetchTasks(isAuthenticated);
  }, [isAuthenticated, fetchTasks]);
  
  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by completion status
    if (filterStatus === 'active' && task.completed) return false;
    if (filterStatus === 'completed' && !task.completed) return false;
    
    // Search filter
    if (searchQuery) {
      return (
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });
  
  // Open modal for new task
  const handleAddNew = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
    setIsModalOpen(true);
  };
  
  // Open modal for editing
  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setIsModalOpen(true);
  };
  
  // Save task (create or update)
  const handleSave = async () => {
    if (!formData.title) {
      alert('Please enter a task title');
      return;
    }
    
    if (editingTask) {
      // Update existing task
      await updateTask(editingTask.id, formData, isAuthenticated);
    } else {
      // Create new task
      await addTask(formData, isAuthenticated);
    }
    
    setIsModalOpen(false);
    setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
  };
  
  // Delete task with confirmation
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id, isAuthenticated);
    }
  };
  
  // Toggle task completion
  const handleToggle = async (id) => {
    await toggleTask(id, isAuthenticated);
  };
  
  const completedCount = tasks.filter(t => t.completed).length;
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tasks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {completedCount} of {tasks.length} completed
          </p>
        </div>
        
        <Button onClick={handleAddNew} className="mt-4 sm:mt-0">
          <Plus className="w-5 h-5 mr-2" />
          New Task
        </Button>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setFilterStatus('active')}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === 'completed' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </Button>
        </div>
      </div>
      
      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery 
              ? 'No tasks found matching your search.' 
              : filterStatus === 'completed'
              ? 'No completed tasks yet.'
              : filterStatus === 'active'
              ? 'No active tasks. Great job!'
              : 'No tasks yet. Add your first task!'}
          </p>
        </div>
      )}
      
      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <Input
              type="text"
              placeholder="Task title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <Textarea
              placeholder="Add details..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button onClick={handleSave} className="flex-1">
              {editingTask ? 'Update' : 'Create'}
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
