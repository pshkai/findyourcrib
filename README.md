# FindYourCrib

[![CI](https://github.com/pshkai/findyourcrib/actions/workflows/ci.yml/badge.svg)](https://github.com/pshkai/findyourcrib/actions/workflows/ci.yml)

FindYourCrib is a property discovery and listing platform for renters, agents, and owners in Thailand.

The project is restarted as a clean monorepo after reviewing the previous implementation. The old repo had useful product ideas, but also committed dependencies, uploaded files, case-colliding component names, and too little documentation for solo maintenance.

## Workspace

- `frontend`: Next.js app for search, property details, dashboards, and account flows.
- `backend`: NestJS API for auth, listings, inquiries, favorites, media, and administration.
- `shared`: Shared TypeScript contracts used by both apps.
- `docs`: Product, API, data, and decision records.

## First Milestone

Build a reliable MVP before optimizing:

- Public listing search and property detail pages.
- Agent registration, login, and listing management.
- Inquiry submission and agent inquiry inbox.
- Admin verification and moderation.
- Typed API contracts, schema-first data model, and repeatable local setup.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run test
```

Each app also has its own scripts under `frontend` and `backend`.

## Demo Accounts

After configuring a PostgreSQL database and running migrations, seed local demo data with:

```bash
npm run prisma:migrate:deploy --workspace backend
npm run prisma:seed --workspace backend
```

Seeded users share the password `Password123!`:

- `admin@findyourcrib.test`
- `agent@findyourcrib.test`
- `renter@findyourcrib.test`

## Deployment Notes

Detailed production steps live in `docs/deployment/production.md`; launch readiness is tracked in `docs/deployment/launch-checklist.md`.

- Vercel should build the frontend with `npm run build --workspace frontend`.
- Render should build the backend with `npm run build --workspace backend` and start it with `npm run start:prod --workspace backend`.
- Render health checks can use `/api/v1/health` for process liveness or `/api/v1/health/ready` when database readiness should gate traffic.
- Set `NEXT_PUBLIC_API_URL` in Vercel to the Render backend URL plus `/api/v1`.
- Set `NEXT_PUBLIC_SITE_URL` in Vercel to the public frontend origin for canonical URLs, robots, and sitemap.
- Set `FRONTEND_URL` in Render to the Vercel frontend URL.
- Keep Vercel `NEXT_PUBLIC_API_URL` and Render `FRONTEND_URL` on HTTPS in production so httpOnly auth cookies can be sent cross-site.
- Add every production frontend origin to Render `FRONTEND_URL`; browser write requests from other origins are rejected.
- Set `DATABASE_URL` in Render to a valid PostgreSQL connection string, then run `npm run prisma:migrate:deploy --workspace backend`.
- Set `JWT_SECRET` in Render to a strong private value. Production startup fails without it.
- Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` in Render for password reset email delivery.
- Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_STORAGE_BUCKET` in Render for signed property image uploads.
- Optional: set `JWT_EXPIRES_IN` in Render, defaulting to `1h`.
- Optional: set `PORT` in Render if the platform does not inject one. The backend validates `PORT`, `DATABASE_URL`, `FRONTEND_URL`, and JWT settings at startup.
