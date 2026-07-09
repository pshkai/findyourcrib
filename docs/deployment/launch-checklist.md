# Launch Readiness Checklist

Use this checklist before calling FindYourCrib production-ready.

## Infrastructure

- [ ] Vercel frontend project points at the latest `main` branch.
- [ ] Render backend project points at the latest `main` branch.
- [ ] Supabase production database is separate from local/demo data.
- [ ] Render health check is set to `/api/v1/health/ready` when database readiness should gate traffic.
- [ ] Production migrations have been applied with `npm run prisma:migrate:deploy --workspace backend`.

## Environment

- [ ] Vercel `NEXT_PUBLIC_API_URL` uses the Render HTTPS API origin plus `/api/v1`.
- [ ] Vercel `NEXT_PUBLIC_SITE_URL` uses the public HTTPS frontend origin.
- [ ] Render `DATABASE_URL` uses the production Supabase connection string.
- [ ] Render `FRONTEND_URL` includes every production frontend origin.
- [ ] Render `JWT_SECRET` is strong, private, and not shared with local development.
- [ ] Render SMTP variables are configured with a verified sender for password reset emails.
- [ ] Render Supabase storage variables are configured with a backend-only service role key.
- [ ] Optional Render `JWT_EXPIRES_IN` is intentionally chosen.

## Product Flows

- [ ] Public home page loads and shows listings or demo fallback.
- [ ] Search results load with filters, pagination, and fallback state.
- [ ] Property detail page loads gallery, facts, agent information, favorites, and inquiry form.
- [ ] Register and login work with httpOnly session cookies.
- [ ] Password reset request/reset flow works with delivered email links.
- [ ] Agent can create, edit, confirm, and delete a listing.
- [ ] Agent can add and remove gallery image URLs.
- [ ] Agent can request signed media upload URLs for listing images.
- [ ] Renter can favorite a property and submit an inquiry.
- [ ] Agent can triage inquiries.
- [ ] Admin can verify, reject, feature, and hide listings.

## Quality Gates

- [ ] GitHub Actions CI passes on `main`.
- [ ] `npm run prisma:validate --workspace backend` passes.
- [ ] `npm run test --workspace backend` passes.
- [ ] `npm run build --workspace backend` passes.
- [ ] `npm run build --workspace frontend` passes.
- [ ] `npm run e2e --workspace frontend` passes.

## Security and Reliability

- [ ] Auth cookies are sent only over HTTPS in production.
- [ ] Browser write origins are restricted by `FRONTEND_URL`.
- [ ] Rate limits are active for register, login, and public inquiries.
- [ ] API error envelopes do not leak unexpected server error details.
- [ ] Render logs show request method, path, status, duration, and client IP.
- [ ] Security headers are present on frontend and backend responses.

## Content and Legal

- [ ] Contact page uses the correct launch email/phone.
- [ ] Privacy page reflects actual data handling.
- [ ] Terms page reflects actual marketplace responsibilities.
- [ ] Sitemap and robots output use the production frontend origin.
- [ ] Demo accounts are not marketed as production accounts.

## Known Post-MVP Work

- [ ] Direct media upload storage instead of URL-only galleries.
- [ ] Password reset and email verification.
- [ ] Refresh-token rotation or longer-lived session strategy.
- [ ] Analytics and error monitoring.
- [ ] Full mobile browser QA on real devices.
