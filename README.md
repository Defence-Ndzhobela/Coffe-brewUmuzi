# Brew Log

A full-stack Coffee Brew Log application built as part of the XPL Full-Stack Developer Bootcamp Assessment.

The application allows users to create, view, filter, edit, and delete coffee brew records. It uses a React frontend, Node.js and Express backend, Prisma ORM, and PostgreSQL database.

---

## Live Demo

Application:
https://defence-coffe-brew.vercel.app/

Backend API:
https://coffe-brewumuzibackend.onrender.com

---

## Project Overview

Brew Log is a coffee-brewing management application designed for keeping track of different brews.

Users can:

- Create a new brew
- View all saved brews
- Filter brews by brewing method
- Edit existing brews
- Delete brews
- View the total number of brews
- Add coffee ratings and tasting notes

The application follows a full-stack architecture where the React frontend communicates with a RESTful JSON API provided by the Express backend.

---

## Features

### Brew Management

- Create a brew
- View brew records
- Edit brew information
- Delete a brew
- View the total brew count

### Filtering

Users can filter brews by brewing method, including:

- Aeropress
- Drip coffee
- V60
- French Press
- Chemex

### Brew Information

Each brew record contains:

- Beans
- Brew method
- Coffee grams
- Water grams
- Rating out of 5
- Tasting notes
- Creation date

### Validation

The application validates brew data on both the frontend and backend.

Required fields cannot be left blank, and numeric fields such as coffee grams, water grams, and rating are validated before saving.

### Responsive Design

The application is designed to work across:

- Desktop
- Tablet
- Mobile

---

## Technology Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Vite

### Backend

- Node.js
- Express.js

### Database

- PostgreSQL
- Neon PostgreSQL

### ORM

- Prisma

### Development Tools

- Git
- GitHub
- npm
- Postman

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

---

## Architecture

┌──────────────────────────┐
│      React Frontend      │
│     TypeScript + Vite    │
└────────────┬─────────────┘
			 │
			 │ HTTP / JSON
			 ▼
┌──────────────────────────┐
│     Express Backend      │
│       REST API           │
└────────────┬─────────────┘
			 │
			 ▼
┌──────────────────────────┐
│       Prisma ORM         │
└────────────┬─────────────┘
			 │
			 ▼
┌──────────────────────────┐
│   PostgreSQL / Neon      │
└──────────────────────────┘

---

## Project Structure

brew-log/
|
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |   |-- AddBrewModal.tsx
|   |   |   |-- BrewCard.tsx
|   |   |   |-- BrewForm.tsx
|   |   |   |-- BrewList.tsx
|   |   |   |-- DeleteConfirmModal.tsx
|   |   |   |-- EditBrewModal.tsx
|   |   |   |-- MethodFilter.tsx
|   |   |   |-- Navbar.tsx
|   |   |   |-- Rating.tsx
|   |   |   |-- StatsSummary.tsx
|   |   |
|   |   |-- data/
|   |   |-- services/
|   |   |-- App.tsx
|   |   |-- index.css
|   |   |-- main.tsx
|   |   |-- types.ts
|   |   |-- vite-env.d.ts
|   |
|   |-- package.json
|   |-- vite.config.ts
|
|-- backend/
|   |-- prisma/
|   |   |-- schema.prisma
|   |
|   |-- src/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- validators/
|   |   |-- app.js
|   |   |-- server.js
|   |
|   |-- .env.example
|   |-- package.json
|
|-- Documentation.md
|-- deployment.md
|-- README.md

---

## API Endpoints

The backend exposes a RESTful JSON API.

General:

- GET /api/health
- POST /api/setup-db

Brews:

- GET /api/brews
- POST /api/brews
- PUT /api/brews/:id
- DELETE /api/brews/:id
- POST /api/brews/reset

---

## Database Model

Main entities:

- BrewMethod
- Brew

Core Brew fields:

- id
- beans
- methodId
- coffeeGrams
- waterGrams
- rating
- tastingNotes
- createdAt
- updatedAt

Prisma is responsible for communication between the Express application and PostgreSQL.

---

## Getting Started

### Prerequisites

Before running the application, install:

- Node.js
- npm
- Git
- PostgreSQL database or Neon PostgreSQL

---

## Installation

Clone the repository:

git clone https://github.com/Defence-Ndzhobela/Coffe-brewUmuzi.git

Move into the project:

cd brew-log

---

## Frontend Setup

Move into the frontend directory:

cd frontend

Install dependencies:

npm install

Set local frontend environment values in frontend/.env, then run:

npm run dev

Frontend runs on:

http://localhost:3000

---

## Backend Setup

Open another terminal and move into backend:

cd backend

Install dependencies:

npm install

Create backend environment file:

copy .env.example .env

Set DATABASE_URL and other values in backend/.env.

---

## Environment Variables

Backend example values:

NODE_ENV=development
PORT=4000
BACKEND_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://...

Frontend example values:

VITE_APP_URL=http://localhost:3000
VITE_API_BASE_URL=http://localhost:4000/api
VITE_API_PROXY_TARGET=http://localhost:4000

Never commit secrets or production credentials.

---

## Database Setup

After configuring DATABASE_URL in backend/.env:

1. Generate Prisma client:

npm run prisma:generate

2. Sync Prisma schema to database:

npm run prisma:push

3. Start backend:

npm start

4. Initialize API schema support endpoint if needed:

POST /api/setup-db

---

## Running Locally

Run backend from backend directory:

npm start

Backend URL:

http://localhost:4000

Run frontend from frontend directory:

npm run dev

Frontend URL:

http://localhost:3000

---

## Validation

Validation includes:

- Required fields must be supplied
- Beans cannot be blank
- Brew method must be selected
- Coffee grams must be a positive number
- Water grams must be a positive number
- Rating must be between 0 and 5

Validation is performed on both frontend and backend.

---

## HTTP Status Codes

- 200 Successful request
- 201 Resource created
- 400 Invalid request or validation failure
- 404 Resource not found
- 500 Internal server error

---

## Security

Security practices used:

- Secrets stored in environment variables
- .env files excluded from Git
- .env.example contains placeholders only
- Input validation before database operations

---

## Deployment

The application is deployed with:

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

Deployment details are documented in deployment.md.

---

## Additional Documentation

More setup and project notes are available in Documentation.md.

---

## Future Improvements

- User authentication
- User-specific brew logs
- Search
- Advanced filtering
- Analytics and statistics
- Automated tests
- CI and CD pipeline

---

## Author

Defence Ndzhobela

This project was developed as part of the XPL Full-Stack Developer Bootcamp Assessment.

---

## License

This project was created for educational and assessment purposes.

---

Icon attribution: Coffee icons created by Magnific - Flaticon
