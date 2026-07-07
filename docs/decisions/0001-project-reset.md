# ADR 0001: Clean Monorepo Reset

## Status

Accepted

## Context

The previous repository contained promising domain work but also committed `node_modules`, uploaded files, a stray file named like a git command, case-colliding frontend component paths, and limited documentation.

## Decision

Restart as a clean monorepo with documentation, shared contracts, and app boundaries before feature implementation.

## Consequences

- We keep the product concepts: verified listings, inquiries, favorites, agent dashboard, admin moderation, and availability confirmation.
- We discard generated dependencies, uploads, fragile casing, and mixed root dependencies.
- The repo starts slower but becomes easier for one developer to own.
