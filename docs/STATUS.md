# FindYourCrib Status

Last updated: 2026-07-10

## Summary

FindYourCrib is MVP/prototype-ready as a codebase. The app has implemented renter discovery, agent listing management, admin moderation, media upload groundwork, SEO/content polish, CI checks, local browser smoke tests, and production smoke tooling.

## Live URLs

- Frontend: `https://findyourcrib.vercel.app`
- Backend API base: `https://findyourcrib.onrender.com/api/v1`

## Implemented MVP Surfaces

- Public home, property search, property details, legal/contact pages, sitemap, robots, and structured data.
- Email/password registration and login endpoints, current-user endpoint, httpOnly session cookies, and password recovery endpoints.
- Renter favorites and public inquiries.
- Agent dashboard, listing create/edit/delete, availability confirmation, inquiry triage, gallery controls, listing completeness checks, and signed Supabase media upload URLs.
- Admin review queue, verify/reject, feature, and hide actions.
- Backend liveness/readiness health checks, request logging, origin protection, rate limits, stable API error envelopes, and deployment runbooks.

## Verified Locally

- Shared package build.
- Prisma schema validation.
- Backend Jest suite.
- Backend production build.
- Frontend production build.
- Playwright public smoke suite.

## Verified Live

- Vercel public pages respond.
- Render health and database readiness respond when the service is warm.
- Production smoke runner passes against public frontend routes and backend health/readiness with a 30 second timeout.

## Known Production Blocker

Render is currently serving an older backend build. Symptoms:

- `POST /api/v1/auth/login` returns `500`.
- `POST /api/v1/auth/register` returns `500`.
- `POST /api/v1/agent/media/upload-url` returns `404`, even though the route exists in the current codebase.

Required action:

1. Set the required Render environment variables from `render.yaml` and `docs/deployment/production.md`.
2. Trigger a Render manual deploy from latest `main`.
3. Re-run `FRONTEND_URL=https://findyourcrib.vercel.app BACKEND_URL=https://findyourcrib.onrender.com/api/v1 SMOKE_TIMEOUT_MS=30000 npm run smoke:production`.
4. Re-test login/register/media upload flows.

## Not Yet Production-Complete

- Render redeploy and production auth/media verification.
- Production monitoring and error tracking.
- Real-device mobile QA.
- Final launch email/domain/legal review.
- Optional email verification and refresh-token strategy.
