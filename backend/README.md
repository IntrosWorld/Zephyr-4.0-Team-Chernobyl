# Life RPG Backend

This is the Express backend for the Life RPG application, featuring Firebase Admin authentication token verification.

## Setup Instructions

1. Ensure you have Node.js installed.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and fill in the values.

### Setting up Firebase Admin

To verify tokens from the frontend, the backend needs a Firebase Service Account key.

1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Select your project: `zephyr-e7310`.
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
