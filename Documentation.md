# Brew Log Documentation

## Project Description
Brew Log is a full-stack coffee tracking application for recording and managing brew entries.
Users can create, read, filter, update, and delete brew records.

## Tech Stack
- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL (Neon)
- ORM: Prisma

## Repository Structure
- frontend: React app and UI components
- backend: Express API and database integration

## Features Implemented
- Create a brew entry and save to database
- Read brew entries in list view
- Filter brew list by method
- Edit and update an existing brew entry
- Delete brew entries
- Basic backend and frontend validation

## API Endpoints
Base URL (local backend): http://localhost:4000

- GET /api/health
- POST /api/setup-db
- GET /api/brews
- POST /api/brews
- PUT /api/brews/:id
- DELETE /api/brews/:id
- POST /api/brews/reset

## Local Setup Instructions

### Prerequisites
- Node.js 18+
- npm
- PostgreSQL connection string (Neon DATABASE_URL)

### 1. Clone and open project
- Clone repository
- Open the brew-log folder

### 2. Backend setup
1. Go to backend folder
2. Install dependencies:
   npm install
3. Create backend environment file from example:
   copy .env.example .env
4. Update DATABASE_URL in backend/.env
5. Start backend:
   npm start

Backend runs on port 4000 by default.

### 3. Frontend setup
1. Go to frontend folder
2. Install dependencies:
   npm install
3. Start frontend:
   npm run dev

Frontend runs on port 3000 and proxies /api requests to backend port 4000.

## Validation Notes
- Frontend validates required fields and numeric ranges before submit.
- Backend validates payload fields and returns HTTP 400 for invalid input.
- Tasting notes are required for create and update operations.

## Troubleshooting
- If you see Cannot GET / on backend, use http://localhost:4000/api/health or ensure backend is running.
- If API requests fail from frontend, verify Vite proxy target in frontend/vite.config.ts and backend port.
- If database calls fail, verify backend/.env DATABASE_URL and test with POST /api/setup-db.

## Current Limitations
- No automated unit or integration tests are configured yet.
