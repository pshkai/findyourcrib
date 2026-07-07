# API Overview

Base path: `/api/v1`

## Public

- `GET /health`
- `GET /properties`
- `GET /properties/:id`
- `GET /properties/featured`
- `POST /inquiries`

## Authenticated

- `GET /auth/me`
- `POST /auth/logout`
- `GET /favorites`
- `POST /favorites/:propertyId`
- `DELETE /favorites/:propertyId`
- `GET /agent/properties`
- `POST /agent/properties`
- `PATCH /agent/properties/:id`
- `DELETE /agent/properties/:id`
- `POST /agent/properties/:id/confirm-availability`
- `GET /agent/inquiries`

## Admin

- `GET /admin/properties/review`
- `POST /admin/properties/:id/verify`
- `POST /admin/properties/:id/feature`
- `POST /admin/properties/:id/hide`

## Response Shape

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```
