# 🚀 Znote - Quick Setup Guide

## Prerequisites Checklist
- [ ] Node.js v18+ installed
- [ ] PostgreSQL installed and running
- [ ] Terminal/Command Prompt ready

## ⚡ 5-Minute Setup

### Step 1: Backend Setup (2 minutes)

```powershell
# Open PowerShell in: f:\Lab arena\Znote\server
cd "f:\Lab arena\Znote\server"

# Install dependencies
npm install

# Edit .env file and update your PostgreSQL credentials
# Change: DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/znote?schema=public"

# Setup database
npx prisma generate
npx prisma migrate dev --name init

# Start backend server
npm run dev
```

**Backend should now be running on http://localhost:5000** ✅

### Step 2: Frontend Setup (2 minutes)

Open a NEW PowerShell window:

```powershell
# Open PowerShell in: f:\Lab arena\Znote\client
cd "f:\Lab arena\Znote\client"

# Install dependencies
npm install

# Start frontend
npm run dev
```

**Frontend should now be running on http://localhost:5173** ✅

### Step 3: Test the App (1 minute)

1. Open browser to http://localhost:5173
2. Click "Get Started Free"
3. Try creating a note, task, or idea
4. Everything works in guest mode immediately!
5. Optional: Click "Login / Sign Up" to create an account

## 🔧 Troubleshooting

### PostgreSQL Connection Failed?

1. Make sure PostgreSQL is running
2. Check your credentials in `server/.env`
3. Try creating the database manually:
   ```sql
   CREATE DATABASE znote;
   ```

### Port Already in Use?

- Backend: Change `PORT=5000` to `PORT=5001` in `server/.env`
- Frontend: Vite will automatically suggest an alternate port

### Packages Not Installing?

```powershell
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

## 📝 Default Configuration

### Backend (.env)
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/znote?schema=public"
JWT_SECRET="znote_secret_key_2025_change_in_production"
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## ✨ What's Next?

After setup:

1. **Test Guest Mode**: Use the app without creating an account
2. **Create Account**: Sign up and see your guest data automatically sync
3. **Customize**: Change colors, themes, add your data
4. **Deploy**: Follow the deployment guide in README.md

## 📚 Useful Commands

### View Database in GUI
```powershell
cd server
npx prisma studio
```
Opens at http://localhost:5555

### Reset Database
```powershell
cd server
npx prisma migrate reset
```

### Build for Production
```powershell
# Backend
cd server
npm start

# Frontend
cd client
npm run build
```

## 🎯 Feature Highlights

✅ **Guest Mode** - No signup required, instant start
✅ **Auto-sync** - Guest data syncs when you create an account  
✅ **Dark Mode** - Toggle in the navigation bar
✅ **Search** - Find notes, tasks, and ideas quickly
✅ **Offline** - Guest mode works without internet
✅ **Secure** - JWT authentication, encrypted passwords

## 🆘 Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review server [README.md](./server/README.md) for API details
- Review client [README.md](./client/README.md) for frontend details
- Look at the comments in the code - every file is well-documented!

---

**Happy organizing with Znote! 📝✨**
