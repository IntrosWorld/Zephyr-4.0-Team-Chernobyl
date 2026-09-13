# Habitify

<p align="center">
  <img src="frontend/public/logo.png" alt="Habitify Logo" width="130" />
</p>

<p align="center">
  <strong>Turn daily habits, todos, and coding activity into an RPG-style adventure.</strong>
</p>

<p align="center">
  A gamified productivity and habit-tracking web application designed to help you build consistency, complete daily quests, maintain streaks, and track your personal growth.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#roadmap">Roadmap</a>
</p>

---

## Preview

<p align="center">
  <strong>Habitify — Level Up Your Life, One Habit at a Time</strong>
</p>

<br />

<table align="center">
  <tr>
    <td align="center">
      <img
        src="frontend/public/login.png"
        alt="Habitify landing page"
        width="420"
      />
    </td>
    <td align="center">
      <img
        src="frontend/public/lofi.png"
        alt="Habitify dashboard"
        width="420"
      />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img
        src="frontend/public/journal.png"
        alt="Habitify habit tracking"
        width="420"
      />
    </td>
    <td align="center">
      <img
        src="frontend/public/quest.png"
        alt="Habitify coding integrations"
        width="420"
      />
    </td>
  </tr>
</table>

<p align="center">
  <em>
    A gamified productivity dashboard for habits, quests, streaks,
    and coding progress.
  </em>
</p>


### Demo
* **Demo Video:** `YOUR_DEMO_VIDEO_URL`
---

## About Habitify

Traditional habit trackers can quickly become repetitive. Habitify makes personal growth more engaging by turning everyday productivity into a game-like progression system.

With Habitify, users can:

* Create and complete daily habits
* Manage todos and recurring tasks
* Build and maintain streaks
* Track personal productivity
* Monitor GitHub activity
* Track LeetCode progress
* View their progress through an RPG-inspired dashboard

Every completed action represents progress toward becoming a better version of yourself.

> **Complete quests. Build streaks. Level up your life.**

---

## Features

- **Auth** - Firebase Authentication (email/password + Google) on the frontend, verified on the backend via Firebase Admin.
- **Tasks** - Legacy one-off habit/daily/todo items with a single `completed` flag, stored per-user in Firestore (`backend/src/controllers/taskController.js`).
- **Habit tracker** - Recurring habits with daily completion logging, current/longest streaks, a weekly calendar grid, and a 90-day heatmap. Completing a habit grants XP/gold and can level you up (`backend/src/services/userService.js`). Confetti fires on each completion, a bigger burst on completing every habit for the day, and a milestone burst on streak milestones (3, 7, 14, 30... days) or a level-up. See `backend/README.md` for the `/api/habits` and `/api/logs` endpoints.
- **Journey map** - A Duolingo-style path of achievement nodes (streak, completion count, and level milestones), unlocked as your stats cross each threshold (`frontend/src/utils/achievements.js`). Computed client-side from the same stats the level card uses — no separate achievements backend.
- **Reminders** - An optional time-of-day per habit (`reminderTime`). While the dashboard tab is open and notifications are allowed, a browser notification fires at that time (`frontend/src/components/habits/RemindersCard.jsx`). The same `reminderTime` also drives an email alert via SMTP (`backend/src/jobs/reminderScheduler.js`) so it still reaches you with the tab closed — SMTP is optional, see `backend/README.md`.
- **GitHub & LeetCode tracking** - Users save their GitHub/LeetCode usernames once, and the dashboard pulls live public stats (repos, contribution streak, problems solved, ranking) on each visit. Details and setup in `backend/README.md`.
