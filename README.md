# Znote - AI-Powered Notes, Tasks & Ideas App

A full-stack web application for managing notes, tasks, and ideas with seamless guest-to-authenticated user flow.

## 🚀 Features

- **Guest Mode**: Start using immediately without signup - data stored in localStorage
- **Notes**: Create color-coded, pinnable notes
- **Tasks**: Manage todos with priorities and due dates
- **Ideas**: Store ideas with categories and tags
- **Authentication**: Optional JWT-based login/signup
- **Auto-Sync**: Guest data automatically syncs when creating an account
- **Dark Mode**: Toggle between light and dark themes
- **Search & Filter**: Find your content quickly
- **Responsive**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS for styling
- Zustand for state management (with persist middleware)
- React Router for navigation
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js + Express
- PostgreSQL database
- Prisma ORM
- JWT authentication
- bcryptjs for password hashing

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
cd "f:\Lab arena\Znote"
```

### 2. Backend Setup

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your PostgreSQL credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/znote?schema=public"
# JWT_SECRET="your_secret_key"

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start the server
npm run dev
```

The backend server will run on **http://localhost:5000**

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on **http://localhost:5173**

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Notes
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/sync` - Bulk create notes (for guest data sync)

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/sync` - Bulk create tasks

### Ideas
- `GET /api/ideas` - Get all ideas
- `GET /api/ideas/:id` - Get single idea
- `GET /api/ideas/search?query=` - Search ideas
- `POST /api/ideas` - Create idea
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `POST /api/ideas/sync` - Bulk create ideas

## 🎯 Usage Flow

### Guest Mode
1. Open the app - no signup required
2. Start creating notes, tasks, and ideas
3. Data is stored in your browser's localStorage
4. Works completely offline

### Creating an Account
1. Click "Login" or "Sign Up"
2. Enter email and password
3. **All your guest data automatically syncs to your account**
4. Guest data is cleared from localStorage
5. Now accessible from any device with your login

### Authenticated Mode
1. Login with your credentials
2. All data is stored in the PostgreSQL database
3. Changes sync in real-time
4. Access from any device

## 🗂️ Project Structure

```
Znote/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # Base components (Button, Input, etc.)
│   │   │   ├── layout/   # Layout components (Navigation)
│   │   │   ├── notes/    # Note-specific components
│   │   │   ├── tasks/    # Task-specific components
│   │   │   └── ideas/    # Idea-specific components
│   │   ├── pages/        # Page components
│   │   ├── stores/       # Zustand state management
│   │   ├── lib/          # Utilities and API client
│   │   ├── App.jsx       # Main app component
│   │   ├── main.jsx      # Entry point
│   │   └── index.css     # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── server/                # Backend Node.js app
    ├── controllers/       # Request handlers
    ├── middleware/        # Auth middleware
    ├── routes/           # API routes
    ├── prisma/           # Database schema
    ├── server.js         # Entry point
    ├── package.json
    └── .env              # Environment variables
```

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/znote?schema=public"
JWT_SECRET="your_super_secret_jwt_key"
PORT=5000
NODE_ENV="development"
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)
1. Push code to GitHub
2. Connect to your deployment platform
3. Set environment variables
4. Deploy PostgreSQL database
5. Run migrations: `npx prisma migrate deploy`

### Frontend Deployment (Vercel/Netlify)
1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Set environment variable: `VITE_API_URL`

## 🧪 Development Commands

### Backend
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (GUI)
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database credentials
- Try: `npx prisma db push` to sync schema

### Port Already in Use
- Backend: Change PORT in server/.env
- Frontend: Vite will prompt for alternate port

### Guest Data Not Syncing
- Check browser console for errors
- Verify API endpoint is accessible
- Ensure JWT token is valid

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using React, Node.js, and PostgreSQL**
