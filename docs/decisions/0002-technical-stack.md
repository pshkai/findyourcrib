# ADR 0002: Next.js, NestJS, Prisma, PostgreSQL

## Status

Accepted

## Decision

Use Next.js for the frontend, NestJS for the backend API, Prisma for database access, and PostgreSQL as the primary database.

## Rationale

- The old project already used this direction, so domain work can be reused mentally without copying brittle implementation.
- NestJS gives clear module boundaries for solo backend maintenance.
- Prisma keeps schema changes visible and reviewable.
- PostgreSQL supports the future location-search path with PostGIS.
