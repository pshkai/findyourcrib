# API Overview

Base path: `/api/v1`

## Public

- `GET /health`
- `GET /properties`
- `GET /properties/:id`
- `GET /properties/featured`
- `POST /inquiries`
- `POST /auth/register`
- `POST /auth/login`

Rate limits:

- `POST /auth/register`: 5 requests per minute per IP.
- `POST /auth/login`: 8 requests per minute per IP.
- `POST /inquiries`: 6 requests per minute per IP.

## Authenticated

- `GET /auth/me`
- `GET /favorites`
- `POST /favorites/:propertyId`
- `DELETE /favorites/:propertyId`
- `GET /agent/inquiries`
- `PATCH /agent/inquiries/:id/status`

## Agent

- `GET /agent/properties`
- `POST /agent/properties`
- `PATCH /agent/properties/:id`
- `DELETE /agent/properties/:id`
- `POST /agent/properties/:id/confirm-availability`

## Admin

- `GET /admin/properties/review`
- `POST /admin/properties/:id/verify`
- `POST /admin/properties/:id/reject`
- `POST /admin/properties/:id/feature`
- `POST /admin/properties/:id/unfeature`
- `POST /admin/properties/:id/hide`

## Response Shape

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

## Property Search Parameters

`GET /properties` accepts `query`, `township`, `province`, `propertyType`, `minPrice`, `maxPrice`, `bedrooms`, `bathrooms`, `page`, `pageSize`, and `sort`.

Sort options: `featured`, `newest`, `price_asc`, `price_desc`.

Search responses include `meta.page`, `meta.pageSize`, and `meta.total` for pagination.

## Implemented in Current Backend Slice

- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`.
- Public property read: `GET /properties`, `GET /properties/featured`, `GET /properties/:id`.
- Agent property management: create, list own, update own, delete own, and confirm availability.
- Inquiries: public inquiry creation and agent inquiry inbox.
- Inquiry triage: agents can mark inquiries as `NEW`, `CONTACTED`, `CLOSED`, or `ARCHIVED`.
- Favorites: authenticated saved listing list, add, and remove.
- Admin moderation: review queue, verify, reject, feature, unfeature, and hide.
