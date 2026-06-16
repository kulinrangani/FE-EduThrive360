# EM360 User App

End-user and organization staff frontend (React + Vite + Tailwind).

## Setup

```bash
cp .env.example .env   # set VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

Default dev URL: `http://localhost:5173` (configure `CORS_ORIGINS` on the backend).

## Who signs in here

| Role | Features |
|------|----------|
| `user` | Register with org code, take published quizzes, view results |
| `org_admin` | Workspace, manage counselors (`/team`) |
| `org_counselor` | Reviews & members placeholders |

Super admins use the **Admin** app instead.

## Quiz flow

1. Dashboard lists published quizzes for your organization.
2. Start attempt → answer questions → submit.
3. Results page shows risk level, category breakdown, and a personalized quote.
