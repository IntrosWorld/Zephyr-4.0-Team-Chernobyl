# Life RPG

A habit tracker that turns your daily habits, todos, and coding activity into an RPG-style stat sheet.

## Structure

- `backend/` - Express API. Verifies Firebase auth tokens, stores tasks and user stats in Firestore, and proxies GitHub/LeetCode stats. See `backend/README.md`.
- `frontend/` - React (Vite) app. Firebase client auth + the dashboard UI. See `frontend/README.md`.

## Getting started

1. `cd backend && npm install && cp .env.example .env` (fill in Firebase Admin credentials, see `backend/README.md`)
2. `cd frontend && npm install && cp .env.example .env` (fill in Firebase client config)
3. Run both: `npm run dev` in `backend/`, `npm run dev` in `frontend/`

## Features

- **Auth** - Firebase Authentication (email/password + Google) on the frontend, verified on the backend via Firebase Admin.
- **Tasks** - Habits, dailies, and todos, stored per-user in Firestore (`backend/src/controllers/taskController.js`).
- **GitHub & LeetCode tracking** - Users save their GitHub/LeetCode usernames once, and the dashboard pulls live public stats (repos, contribution streak, problems solved, ranking) on each visit. Details and setup in `backend/README.md`.
