# FindYourCrib

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
