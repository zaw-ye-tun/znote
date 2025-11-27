import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Navigation } from './components/layout/Navigation';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { NotesPage } from './pages/NotesPage';
import { TasksPage } from './pages/TasksPage';
import { IdeasPage } from './pages/IdeasPage';
import { useThemeStore } from './stores/themeStore';

/**
 * Main App Component
 * 
 * Sets up routing and global layout.
 * Routes:
 * - / : Home/landing page
 * - /login : Login/register page
 * - /notes : Notes management
 * - /tasks : Tasks management
 * - /ideas : Ideas management
 * 
 * All routes are accessible to both guest and authenticated users.
 */

function App() {
  const { initTheme } = useThemeStore();
  
  // Initialize theme on app mount
  useEffect(() => {
    initTheme();
  }, [initTheme]);
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Routes>
          {/* Home page without navigation */}
          <Route path="/" element={<HomePage />} />
          
          {/* Auth page without navigation */}
          <Route path="/login" element={<AuthPage />} />
          
          {/* App pages with navigation */}
          <Route
            path="/*"
            element={
              <>
                <Navigation />
                <Routes>
                  <Route path="/notes" element={<NotesPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/ideas" element={<IdeasPage />} />
                  
                  {/* Redirect unknown routes to notes */}
                  <Route path="*" element={<Navigate to="/notes" replace />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
