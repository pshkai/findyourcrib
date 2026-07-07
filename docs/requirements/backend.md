# Backend Requirements

## Stack

- NestJS with TypeScript.
- Prisma with PostgreSQL.
- JWT access tokens, refresh-token rotation planned after MVP auth is stable.
- Zod or class-validator at the API boundary; shared response contracts in `shared`.

## Core Modules

- Auth: register, login, current user, role guards.
- Users: profile and agent public profile.
- Properties: CRUD, search, verification, availability confirmation, media.
- Favorites: renter saved listings.
- Inquiries: renter-to-agent contact workflow.
- Admin: moderation and listing verification.

## Current Implementation Status

- Done: JWT auth foundation, user service, public property search, featured properties, property detail, agent-owned property management, and inquiry creation/inbox.
- Next: favorites, admin moderation, media upload workflow, seed data, and e2e tests.

## Non-Functional Requirements

- No uploaded media or generated build artifacts in Git.
- All list endpoints are paginated.
- Search must be database-filtered, including location radius once PostGIS is enabled.
- Every mutating endpoint checks ownership or role.
- API responses are stable and documented before frontend integration.
