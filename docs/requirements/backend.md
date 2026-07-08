# Backend Requirements

## Stack

- NestJS with TypeScript.
- Prisma with PostgreSQL.
- JWT access tokens with explicit expiry, refresh-token rotation planned after MVP auth is stable.
- Zod or class-validator at the API boundary; shared response contracts in `shared`.

## Core Modules

- Auth: register, login, current user, role guards.
- Users: profile and agent public profile.
- Properties: CRUD, search, verification, availability confirmation, media.
- Favorites: renter saved listings.
- Inquiries: renter-to-agent contact workflow.
- Admin: moderation and listing verification.

## Current Implementation Status

- Done: JWT auth foundation, user service, public property search, featured properties, property detail, agent-owned property management, inquiry creation/inbox, favorites, admin moderation, and seed data.
- Next: media upload workflow, migrations, e2e tests, refresh tokens, and frontend API integration.

## Non-Functional Requirements

- No uploaded media or generated build artifacts in Git.
- All list endpoints are paginated.
- Search must be database-filtered, including location radius once PostGIS is enabled.
- Every mutating endpoint checks ownership or role.
- API responses are stable and documented before frontend integration.
- Backend startup validates `PORT`, `DATABASE_URL`, `FRONTEND_URL`, and JWT settings before accepting traffic.
- Production requires `DATABASE_URL` and a private `JWT_SECRET`; local development falls back to safe local defaults.
- Browser-origin write requests are restricted to configured `FRONTEND_URL` origins to protect cookie-authenticated sessions.
