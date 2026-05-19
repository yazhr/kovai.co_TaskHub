# TaskHub Backend

Minimal Express backend for TaskHub.

Environment:
- Create a `.env` based on `.env.example` and set `MONGO_URI`.

Run:

```
npm install
npm run dev
```

API:
- `POST /tasks` -> create task (header `x-user-id` required)
- `GET /tasks` -> get tasks for user (header `x-user-id` required)
- `PUT /tasks/:id` -> update status (header `x-user-id` required)

Note: For assessment simplicity the backend trusts the `x-user-id` header. In production, verify Firebase ID tokens server-side.
