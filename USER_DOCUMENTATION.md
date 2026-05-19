# TaskHub User Documentation

This document explains how to access and use TaskHub, login instructions, important assumptions, known limitations, important notes/warnings, and setup instructions.

## How to Access and Use the Application

1. Open the frontend URL shown when you start the frontend server. The default is **http://localhost:5173**.
2. The app has three main screens: **Tasks**, **Insights**, and **Calendar**. Use the header tabs to switch between them.
3. **Create a task** by entering a title in the Add task input and pressing Enter or clicking Add task.
4. **Change a task's status** using the status dropdown on each task card.

## Login Instructions

- Sign in using **Google authentication** by clicking the Sign in with Google button on the Login screen.
- The app uses **Firebase Authentication**.
- Required Firebase config values are read from environment variables:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_APP_ID`

## Important Assumptions Made

- Each user is uniquely identified by their Google account, and task data is scoped to the signed-in user.
- Tasks in the Calendar use each task's `createdAt` timestamp.
- If you want tasks to be scheduled by due date, the backend and UI must be extended.
- The frontend expects the API at **http://localhost:4000** by default.

## Known Limitations

- **No offline sync.** The UI requires the backend to be available to load and save tasks.
- **No per-task due date or scheduling.** The calendar uses `createdAt` for grouping.
- **No role-based access control or multi-user sharing.** Tasks are private to a Google user.
- **The calendar** is a simple month view and not a full-featured scheduler.

## Important Notes and Warnings for Users

- ⚠️ **Do not commit or share sensitive Firebase API keys publicly.** Use environment variables or secrets management for production.
- If port 5173 is already in use, the frontend server will try the next port automatically, up to 10 attempts.
- The repository originally contained `node_modules`; these were removed from tracking and added to `.gitignore`.
- If you copied the project files manually, run `npm install` in the relevant folders.

## Setup Instructions

### Prerequisites

- Node.js
- npm
- Git

### Backend Setup

1. Open a terminal.
2. Run:
   ```bash
   cd taskhub-backend
   npm install
   node server.js
   ```
3. The backend listens on **port 4000** by default.

### Frontend Setup

1. Open a new terminal.
2. Run:
   ```bash
   cd taskhub-frontend
   npm install
   npm run dev
   ```
3. The frontend serves files and logs the URL and port it uses. The default is **http://localhost:5173**. If 5173 is busy, it will try the next port.

### Environment Variables

Create a `.env` file or use your environment to set:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Optional:** Set `VITE_API_BASE` to point the frontend to a different backend host.

### Stopping the Servers on Windows PowerShell

Find the process using the port:

```powershell
netstat -ano | Select-String ":5173"
```

Stop it:

```powershell
Stop-Process -Id <PID> -Force
```

## Project Features

- ✅ Full-stack TaskHub application with separate frontend and backend modules
- ✅ Google sign-in using Firebase Authentication for secure user access
- ✅ Private task management where each user sees only their own tasks
- ✅ Task creation, status update, and task listing features
- ✅ Multiple views: Tasks, Insights, and Calendar for better usability
- ✅ Frontend-to-backend API integration for fetching and updating task data
- ✅ Environment-based configuration for Firebase and backend API settings
- ✅ Clean and simple user interface for easier task tracking
- ✅ Lightweight application that runs locally using Node.js and npm

## Useful Files in This Project

- **src/components/Dashboard.jsx** — main UI and API calls
- **src/firebase.js** — Firebase configuration
- **serve.js and start-server.js** — simple local static server used by the frontend

## Repository

**GitHub:** https://github.com/yazhr/kovai.co_TaskHub.git
