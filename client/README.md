# Znote Frontend Client

React + Vite frontend for Znote app with Tailwind CSS and Zustand.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:5173

## Environment Setup

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Project Structure

```
client/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Textarea.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Modal.jsx
│   │   ├── layout/         # Layout components
│   │   │   └── Navigation.jsx
│   │   ├── notes/          # Note components
│   │   │   └── NoteCard.jsx
│   │   ├── tasks/          # Task components
│   │   │   └── TaskCard.jsx
│   │   └── ideas/          # Idea components
│   │       └── IdeaCard.jsx
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx
│   │   ├── AuthPage.jsx
│   │   ├── NotesPage.jsx
│   │   ├── TasksPage.jsx
│   │   └── IdeasPage.jsx
│   ├── stores/             # Zustand stores
│   │   ├── authStore.js    # Authentication state
│   │   ├── notesStore.js   # Notes state
│   │   ├── tasksStore.js   # Tasks state
│   │   ├── ideasStore.js   # Ideas state
│   │   └── themeStore.js   # Theme state
│   ├── lib/                # Utilities
│   │   ├── api.js          # Axios instance
│   │   └── utils.js        # Helper functions
│   ├── App.jsx             # Main app
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## State Management

Znote uses **Zustand** with persist middleware for state management.

### Stores

1. **authStore** - User authentication and login state
2. **notesStore** - Notes CRUD operations
3. **tasksStore** - Tasks CRUD operations
4. **ideasStore** - Ideas CRUD operations
5. **themeStore** - Dark/light theme

### Guest Mode

All stores automatically persist to localStorage when in guest mode, enabling offline usage.

### Authenticated Mode

When logged in, stores fetch from and sync to the backend API.

## Styling

- **Tailwind CSS** for utility-first styling
- **Dark mode** support via class strategy
- **Custom color palette** in tailwind.config.js
- **Responsive** design for all screen sizes

## Components

### UI Components

Reusable base components with consistent styling:
- Button (variants: default, secondary, danger, ghost)
- Input (text, email, password, date)
- Textarea
- Card
- Modal

### Feature Components

Specialized components for each feature:
- NoteCard - Display note with color, pin, edit, delete
- TaskCard - Display task with checkbox, priority, due date
- IdeaCard - Display idea with category, tags

## Key Features

### Guest Mode
- Start using immediately
- Data stored in localStorage
- No internet required
- Perfect for quick notes

### Account Creation
- Seamless signup process
- **Automatic sync of guest data**
- Data persists across devices
- Secure JWT authentication

### Theme Toggle
- Light/dark mode
- Persists preference
- System preference detection (optional)

## Building for Production

```bash
# Build optimized production bundle
npm run build

# Output will be in dist/ folder
# Deploy dist/ folder to any static hosting (Vercel, Netlify, etc.)
```

## Environment Variables

For production, set:
```env
VITE_API_URL=https://your-backend-api.com/api
```

## Dependencies

### Core
- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Routing
- **zustand** - State management
- **axios** - HTTP client

### UI
- **tailwindcss** - CSS framework
- **lucide-react** - Icons
- **clsx** - Class name utility
- **tailwind-merge** - Merge Tailwind classes

### Dev Tools
- **vite** - Build tool
- **@vitejs/plugin-react** - React plugin for Vite
- **eslint** - Code linting
- **autoprefixer** - CSS prefixing
- **postcss** - CSS processing
