import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import tasksRoutes from './routes/tasksRoutes.js';
import ideasRoutes from './routes/ideasRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Middleware Configuration
 */

// CORS - Allow frontend to communicate with backend
// In production, restrict this to your frontend domain
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.com' 
    : 'http://localhost:5173', // Vite default port
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

/**
 * Routes
 */

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Znote API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// API Routes
app.use('/api/auth', authRoutes);    // Authentication routes
app.use('/api/notes', notesRoutes);  // Notes CRUD + sync
app.use('/api/tasks', tasksRoutes);  // Tasks CRUD + sync
app.use('/api/ideas', ideasRoutes);  // Ideas CRUD + sync + search

/**
 * Error Handling Middleware
 */

// 404 handler - Route not found
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log(`🚀 Znote API server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}`);
  console.log(`\n📚 API Endpoints:`);
  console.log(`   Auth: http://localhost:${PORT}/api/auth`);
  console.log(`   Notes: http://localhost:${PORT}/api/notes`);
  console.log(`   Tasks: http://localhost:${PORT}/api/tasks`);
  console.log(`   Ideas: http://localhost:${PORT}/api/ideas`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});
