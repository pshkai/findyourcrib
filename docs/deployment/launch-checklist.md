# Launch Readiness Checklist

Use this checklist before calling FindYourCrib production-ready. The codebase is MVP/prototype-ready; the remaining unchecked items are hosted-production validation and launch operations.

## MVP/Prototype Status

- [x] Public search, listing results, property detail, and inquiry surfaces are implemented.
- [x] Auth, password recovery, role-protected dashboards, favorites, agent listing CRUD, media upload URLs, and admin review flows are implemented.
- [x] SEO metadata, structured data, sitemap, robots, health checks, CI, local browser smoke tests, and production smoke tooling are implemented.
- [ ] Render backend has been redeployed from latest `main` and verified for auth/media routes.

## Infrastructure

- [x] Vercel frontend project points at the latest `main` branch.
- [ ] Render backend project points at the latest `main` branch and has deployed the latest commit.
- [ ] Supabase production database is separate from local/demo data.
- [ ] Render health check is set to `/api/v1/health/ready` when database readiness should gate traffic.
- [ ] Production migrations have been applied with `npm run prisma:migrate:deploy --workspace backend`.

## Environment

- [x] Vercel `NEXT_PUBLIC_API_URL` uses or is normalized to the Render HTTPS API origin plus `/api/v1`.
- [x] Vercel `NEXT_PUBLIC_SITE_URL` uses the public HTTPS frontend origin.
- [ ] Render `DATABASE_URL` uses the production Supabase connection string.
- [ ] Render `FRONTEND_URL` includes every production frontend origin.
- [ ] Render `JWT_SECRET` is strong, private, and not shared with local development.
- [ ] Render SMTP variables are configured with a verified sender for password reset emails.
- [ ] Render Supabase storage variables are configured with a backend-only service role key.
- [ ] Optional Render `JWT_EXPIRES_IN` is intentionally chosen.

## Product Flows

- [x] Public home page loads and shows listings or demo fallback.
- [x] Search results load with filters, pagination, and fallback state.
- [x] Property detail page loads gallery, facts, agent information, favorites, and inquiry form.
- [ ] Register and login work with httpOnly session cookies on the live Render deployment.
- [ ] Password reset request/reset flow works with delivered email links on the live Render deployment.
- [x] Agent can create, edit, confirm, and delete a listing in the implemented app flow.
- [x] Agent can add, remove, reorder, and choose cover images.
- [x] Agent can request signed media upload URLs for listing images in the implemented backend.
- [x] Renter can favorite a property and submit an inquiry in the implemented app flow.
- [x] Agent can triage inquiries in the implemented app flow.
- [x] Admin can verify, reject, feature, and hide listings in the implemented app flow.

## Quality Gates

- [ ] GitHub Actions CI passes on `main`.
- [x] `npm run prisma:validate --workspace backend` passes.
- [x] `npm run test --workspace backend` passes.
- [x] `npm run build --workspace backend` passes.
- [x] `npm run build --workspace frontend` passes.
- [x] `npm run e2e --workspace frontend` passes.

## Security and Reliability

- [ ] Auth cookies are sent only over HTTPS in production.
- [x] Browser write origins are restricted by `FRONTEND_URL`.
- [x] Rate limits are active for register, login, and public inquiries.
- [x] API error envelopes do not leak unexpected server error details.
- [x] Render logs are implemented to show request method, path, status, duration, and client IP.
- [x] Security headers are present on frontend and backend responses.

## Content and Legal

- [ ] Contact page uses the correct launch email/phone.
- [ ] Privacy page reflects actual data handling.
- [ ] Terms page reflects actual marketplace responsibilities.
- [x] Sitemap and robots output use the production frontend origin.
- [x] Demo accounts are documented as seeded demo accounts, not marketed as production accounts.

## Known Post-MVP Work

- [x] Direct media upload storage instead of URL-only galleries.
- [x] Password reset request/reset flow.
- [ ] Email verification.
- [ ] Refresh-token rotation or longer-lived session strategy.
- [ ] Analytics and error monitoring.
- [ ] Full mobile browser QA on real devices.
