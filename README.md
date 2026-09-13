# Habitify

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
- **Tasks** - Legacy one-off habit/daily/todo items with a single `completed` flag, stored per-user in Firestore (`backend/src/controllers/taskController.js`).
- **Habit tracker** - Recurring habits with daily completion logging, current/longest streaks, a weekly calendar grid, and a 90-day heatmap. Completing a habit grants XP/gold and can level you up (`backend/src/services/userService.js`). Confetti fires on each completion, a bigger burst on completing every habit for the day, and a milestone burst on streak milestones (3, 7, 14, 30... days) or a level-up. See `backend/README.md` for the `/api/habits` and `/api/logs` endpoints.
- **Journey map** - A Duolingo-style path of achievement nodes (streak, completion count, and level milestones), unlocked as your stats cross each threshold (`frontend/src/utils/achievements.js`). Computed client-side from the same stats the level card uses — no separate achievements backend.
- **Reminders** - An optional time-of-day per habit (`reminderTime`). While the dashboard tab is open and notifications are allowed, a browser notification fires at that time (`frontend/src/components/habits/RemindersCard.jsx`). The same `reminderTime` also drives an email alert via SMTP (`backend/src/jobs/reminderScheduler.js`) so it still reaches you with the tab closed — SMTP is optional, see `backend/README.md`.
- **GitHub & LeetCode tracking** - Users save their GitHub/LeetCode usernames once, and the dashboard pulls live public stats (repos, contribution streak, problems solved, ranking) on each visit. Details and setup in `backend/README.md`.
