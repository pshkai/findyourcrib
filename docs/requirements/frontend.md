# Frontend Requirements

## Stack

- Next.js App Router with TypeScript.
- Server-first rendering for public search pages.
- Client components only for interactive forms, filters, dashboards, and auth state.

## Experience Principles

- The first screen is the property search experience, not a marketing splash.
- Dense, scannable listing cards with price, location, size, beds, baths, verification, and strong listing imagery.
- Mobile filters use a drawer; desktop filters stay visible.
- Agent dashboard prioritizes actions: add listing, confirm availability, reply to inquiries, fix incomplete listings.

## Pages

- `/`: Search-led home with featured and recent verified listings.
- `/properties`: Search results.
- `/properties/[id]`: Details and inquiry form.
- `/login`, `/register`: Account entry.
- `/dashboard`: Agent overview.
- `/dashboard/listings`: Agent listings.
- `/dashboard/listings/new`: Create listing.
- `/admin`: Admin review queue.

## Current Implementation Status

- Done: API-aware home featured listings, API-aware property search with demo fallback, property detail and inquiry form, login/register screens wired to auth endpoints, dashboard navigation shell, authenticated listings/inquiries/favorites pages, listing create/edit forms, gallery URL entry, and admin review UI.
- Next: direct media upload storage, better auth persistence with secure cookies, and full browser QA against local backend.
