# Habitify Backend

This is the Express backend for Habitify, featuring Firebase Admin authentication token verification.

## Setup Instructions

1. Ensure you have Node.js installed.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and fill in the values.

### Setting up Firebase Admin

To verify tokens from the frontend, the backend needs a Firebase Service Account key.

1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Select your project: `habitify-101d7`.
3. Go to **Project Settings** (gear icon) -> **Service accounts**.
4. Click **Generate new private key**. This will download a JSON file.
5. Open the JSON file and copy the values into your `.env` file:
   - `FIREBASE_PROJECT_ID`: Copy the `project_id` from the JSON.
   - `FIREBASE_CLIENT_EMAIL`: Copy the `client_email` from the JSON.
   - `FIREBASE_PRIVATE_KEY`: Copy the `private_key` exactly as it appears. Ensure you keep the `\n` newline characters intact within the quotes if pasting directly, or you can enclose the key in double quotes in your `.env` file. Our `firebaseAdmin.js` config replaces literal `\n` characters with actual newlines to prevent parsing errors.

> **Warning:** NEVER commit your `.env` file or expose your service account private key to the frontend or public repositories.

## Running the Server

Run the development server using:
```bash
node src/server.js
```
The server will start on port `5000` (or whatever is specified in `.env`).

## API Endpoints

- `GET /api/health` - Basic health check endpoint.
- `GET /api/user/me` - (Protected) Returns verified user information from the provided Firebase Bearer token.
- `GET /api/tasks` / `POST /api/tasks` / `PUT /api/tasks/:id` / `DELETE /api/tasks/:id` - (Protected) Legacy generic CRUD for one-off habit/daily/todo items with a single `completed` flag. Superseded by `/api/habits` + `/api/logs` below for anything that needs streaks or history.
- `GET /api/habits` / `POST /api/habits` / `PUT /api/habits/:id` / `PUT /api/habits/:id/archive` / `DELETE /api/habits/:id` - (Protected) CRUD for a user's recurring habits.
- `GET /api/logs/today` / `GET /api/logs/range?start&end` / `GET /api/logs/heatmap` / `POST /api/logs` / `DELETE /api/logs` - (Protected) Per-day completion logs for habits: today's completions, a date-range slice (e.g. for a weekly grid), a 90-day daily count series (for a heatmap), and marking/unmarking a habit done on a given date.
- `PUT /api/integrations` - (Protected) Save the GitHub and/or LeetCode usernames to track. Body: `{ "github": "octocat", "leetcode": "someuser" }`. Either field can be omitted to leave it unchanged, or set to `""`/`null` to clear it.
- `GET /api/integrations/github` - (Protected) Fetches live stats for the user's saved GitHub username: public repo count, followers, and (if `GITHUB_TOKEN` is set) total contributions and current streak.
- `GET /api/integrations/leetcode` - (Protected) Fetches live stats for the user's saved LeetCode username: total/easy/medium/hard problems solved, ranking, and current streak.

### Habits & logs

Habits (`src/controllers/habitController.js`) and their per-day completions (`src/controllers/logController.js`) are stored as two separate Firestore collections, `habits` and `habitLogs`, rather than reusing the older `tasks` collection — a habit needs a full history of which days it was done to compute streaks and the heatmap, which a single `completed` boolean can't represent.

- Deleting a habit cascades to delete all of its logs (one batched Firestore write).
- `GET /api/logs/range` and `GET /api/logs/heatmap` filter in memory over all of a user's logs rather than issuing a Firestore range query, so no composite index is required. This is fine at habit-tracker scale (one user's logs, not a shared dataset).
- The frontend computes streaks itself from the raw log dates (`frontend/src/utils/dateHelpers.js`) rather than the backend precomputing them, since the "current" streak depends on the caller's notion of "today."
- Each habit stores a `color` (hex string, used for its checkmark in the weekly grid) alongside its `icon`. If the client doesn't send one, `POST /api/habits` assigns the next color in a fixed rotation (`src/utils/habitColors.js`) so habits stay visually distinct.

### Rewards (XP, gold, levels)

`POST /api/logs` (marking a habit done) and `DELETE /api/logs` (undoing it) both call `applyHabitReward` (`src/services/userService.js`), which adjusts the user's `stats.xp`/`stats.gold` by a fixed amount per completion and recomputes `stats.level` as `floor(xp / 100) + 1`. This runs inside a Firestore transaction since completions can happen in quick succession. Both endpoints return the updated `stats` alongside the log so the frontend can update the level display and trigger a level-up celebration without a separate request.

### GitHub & LeetCode integrations

Both integrations read from public data only, using the username the user saves via `PUT /api/integrations` (stored on their Firestore user doc under `integrations.github` / `integrations.leetcode`, see `src/services/userService.js`).

- **GitHub** (`src/services/githubService.js`) calls the public REST API for profile info (no token required). Contribution streak and total-contributions count require GitHub's GraphQL API, which needs a token — set `GITHUB_TOKEN` in `.env` to a personal access token with no scopes to enable it. Without a token, `totalContributions` and `currentStreak` are returned as `null`.
- **LeetCode** (`src/services/leetcodeService.js`) calls LeetCode's public (unofficial, undocumented) GraphQL endpoint at `leetcode.com/graphql`. No token is needed, but this endpoint isn't officially supported by LeetCode and could change without notice.
