# TaskHub (Assessment)

This repository contains a minimal Task Management app (TaskHub) with:
- Backend: Express + MongoDB (taskhub-backend)
- Frontend: React (Vite) + Firebase Google Sign-In (taskhub-frontend)

Quick setup:

1. Backend

```
cd taskhub-backend
npm install
# create .env from .env.example and set MONGO_URI
npm run dev
```

2. Frontend

```
cd taskhub-frontend
npm install
# create .env from .env.example and set Firebase values
npm run dev
```

Important notes and limitations:
- For assessment simplicity the backend trusts the `x-user-id` header sent by the frontend. In production you should verify Firebase ID tokens using Firebase Admin SDK.
- The app is intentionally minimal: create, list, update status for tasks.

AI Usage Summary:
- I used AI-assisted scaffolding and guidance to structure the app, and wrote the code manually based on the requested spec.
