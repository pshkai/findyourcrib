# Production Deployment Runbook

This runbook keeps Vercel, Render, and Supabase changes repeatable.

## Required Environment

### Frontend on Vercel

- `NEXT_PUBLIC_API_URL`: Render API origin plus `/api/v1`.
- `NEXT_PUBLIC_SITE_URL`: public Vercel frontend origin.

### Backend on Render

- `DATABASE_URL`: Supabase PostgreSQL connection string.
- `FRONTEND_URL`: comma-separated allowed frontend origins.
- `JWT_SECRET`: strong private value, never `replace-me`.
- `JWT_EXPIRES_IN`: optional, defaults to `1h`.
- `PORT`: optional when Render injects it.
- `SMTP_HOST`: SMTP server hostname for password reset emails.
- `SMTP_PORT`: SMTP server port, defaults to `587`.
- `SMTP_SECURE`: `true` for implicit TLS, otherwise `false`.
- `SMTP_USER`: SMTP username when required by the provider.
- `SMTP_PASS`: SMTP password or API key when required by the provider.
- `SMTP_FROM`: verified sender, for example `FindYourCrib <support@example.com>`.
- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key, backend only.
- `SUPABASE_STORAGE_BUCKET`: public bucket for property images, for example `property-media`.

## Build and Start Commands

Frontend:

```bash
npm run build --workspace frontend
```

Backend:

```bash
npm run build --workspace backend
npm run start:prod --workspace backend
```

## Database Migration Flow

Run migrations before sending production traffic to a backend version that expects new schema.

```bash
npm run prisma:validate --workspace backend
npm run prisma:migrate:deploy --workspace backend
```

Use `prisma:migrate:deploy` for Supabase/production. Use `prisma:migrate` only for local development when creating new migrations.

## Health Checks

- Liveness: `/api/v1/health`
- Database readiness: `/api/v1/health/ready`

Use readiness when Render should avoid routing traffic until Supabase is reachable.

## Post-Deploy Smoke Checks

Run the automated public smoke check after each deploy:

```bash
FRONTEND_URL=https://your-vercel-app.vercel.app BACKEND_URL=https://your-render-api.onrender.com npm run smoke:production
```

The smoke runner checks the Vercel home page, property search page, `robots.txt`, Render liveness, and Render database readiness. `BACKEND_URL` can be either the Render origin or the API base URL that ends in `/api/v1`.

1. Open the Vercel frontend home page.
2. Open `/properties?query=Bangkok`.
3. Register or log in with a non-admin account.
4. Confirm `/dashboard/listings/new` loads after auth.
5. Request a password reset and confirm the email arrives with a `/reset-password?token=...` link.
6. Request an agent media upload URL and confirm the returned public URL points at the configured storage bucket.
7. Open Render logs and confirm request logs include method, path, status, duration, and client IP.
