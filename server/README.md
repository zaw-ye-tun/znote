# Znote Backend Server

Express.js API server for Znote app with PostgreSQL and Prisma.

## Quick Start

```bash
# Install dependencies
npm install

# Configure database
# Edit .env with your PostgreSQL credentials

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start server
npm run dev
```

## Environment Setup

Create a `.env` file (copy from `.env.example`):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/znote?schema=public"
JWT_SECRET="your_secret_key"
PORT=5000
NODE_ENV="development"
```

## Database Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio
```

## API Testing

You can test the API using curl, Postman, or any HTTP client.

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Create Note (with auth)
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"My Note","content":"Note content"}'
```

## Project Structure

```
server/
├── controllers/          # Business logic
│   ├── authController.js
│   ├── notesController.js
│   ├── tasksController.js
│   └── ideasController.js
├── middleware/          # Custom middleware
│   └── auth.js         # JWT verification
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── notesRoutes.js
│   ├── tasksRoutes.js
│   └── ideasRoutes.js
├── prisma/             # Database
│   └── schema.prisma   # Database schema
├── server.js           # Entry point
├── package.json
└── .env               # Environment variables
```

## Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **@prisma/client** - Prisma ORM client
- **prisma** - Prisma CLI (dev dependency)
- **nodemon** - Auto-restart server (dev dependency)
