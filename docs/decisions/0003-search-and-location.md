# ADR 0003: Database-First Search

## Status

Accepted

## Context

The previous nearby search loaded candidate properties into application memory and filtered there. That is acceptable for demos but will fail with real inventory.

## Decision

All search filters must be represented in database queries. Radius search starts with bounded latitude and longitude filters and moves to PostGIS before launch traffic.

## Consequences

- Search endpoints are paginated from day one.
- Location fields are first-class in the schema.
- The API contract separates structured filters from free-text query.
