import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useNotesStore } from '../stores/notesStore';
import { useTasksStore } from '../stores/tasksStore';
import { useIdeasStore } from '../stores/ideasStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

/**
 * Login/Register Page
 * 
 * Combined page for user authentication.
 * Features:
 * - Toggle between login and register mode
 * - Email/password authentication
 * - Automatic sync of guest data when creating account
 * - Redirect to notes page after successful auth
 */

export function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const { notes, getNotesForSync, clearNotes } = useNotesStore();
  const { tasks, getTasksForSync, clearTasks } = useTasksStore();
  const { ideas, getIdeasForSync, clearIdeas } = useIdeasStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  
  // Check if user has guest data to sync
  const hasGuestData = notes.length > 0 || tasks.length > 0 || ideas.length > 0;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login existing user
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          navigate('/notes');
        } else {
          setError(result.error || 'Login failed');
        }
      } else {
        // Register new user
        // Prepare guest data for sync
        const guestData = hasGuestData ? {
          notes: getNotesForSync(),
          tasks: getTasksForSync(),
          ideas: getIdeasForSync()
        } : null;
        
        const result = await register(
          formData.email,
          formData.password,
          formData.name,
          guestData
        );
        
        if (result.success) {
          // Clear local guest data after successful sync
          if (hasGuestData) {
            clearNotes();
            clearTasks();
            clearIdeas();
          }
          
          navigate('/notes');
        } else {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">Z</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to Znote
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isLogin ? 'Login to sync your data' : 'Create account to save your data online'}
          </p>
        </div>
        
        {/* Guest Data Notice */}
        {!isLogin && hasGuestData && (
          <div className="mb-6 p-3 bg-primary-50 dark:bg-primary-900 border border-primary-200 dark:border-primary-800 rounded-lg">
            <p className="text-sm text-primary-800 dark:text-primary-200">
              📦 You have {notes.length} notes, {tasks.length} tasks, and {ideas.length} ideas. 
              They'll be synced to your new account!
            </p>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name (optional)
              </label>
              <Input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password *
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              'Processing...'
            ) : isLogin ? (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>
        
        {/* Toggle Login/Register */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
        
        {/* Continue as Guest */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/notes')}
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            Continue as guest
          </button>
        </div>
      </Card>
    </div>
  );
}
