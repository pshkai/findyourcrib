# API Overview

Base path: `/api/v1`

## Public

- `GET /health`
- `GET /health/ready`
- `GET /properties`
- `GET /properties/:id`
- `GET /properties/featured`
- `POST /inquiries`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

Rate limits:

- `POST /auth/register`: 5 requests per minute per IP.
- `POST /auth/login`: 8 requests per minute per IP.
- `POST /inquiries`: 6 requests per minute per IP.

Auth notes:

- `POST /auth/register` and `POST /auth/login` return the access token for API clients and set an httpOnly `fyc_session` cookie for browser clients.
- Authenticated browser requests should send credentials. Non-browser API clients can continue using `Authorization: Bearer <token>`.
- `POST /auth/logout` clears the browser session cookie.
- Mutating browser requests with an `Origin` header must come from a configured `FRONTEND_URL` origin.
- `POST /auth/forgot-password` always returns success-shaped output to avoid account enumeration. Non-production responses include `meta.resetToken` until email delivery is wired.
- `POST /auth/reset-password` accepts `{ "token": "...", "password": "..." }` and clears the token after use.

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

Agent property create/update requests accept either a legacy `coverImageUrl` or an ordered `images` array:

```json
{
  "images": [
    { "imageUrl": "https://cdn.example.com/living.jpg", "altText": "Living room" },
    { "imageUrl": "https://cdn.example.com/bedroom.jpg" }
  ]
}
```

The API de-duplicates image URLs, stores display order, and uses the first image as the listing cover.

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

Error responses use the same envelope:

```json
{
  "data": null,
  "meta": {},
  "error": {
    "statusCode": 400,
    "message": "Validation or request error"
  }
}
```

## Property Search Parameters

`GET /properties` accepts `query`, `township`, `province`, `propertyType`, `minPrice`, `maxPrice`, `bedrooms`, `bathrooms`, `page`, `pageSize`, and `sort`.

Sort options: `featured`, `newest`, `price_asc`, `price_desc`.

Search responses include `meta.page`, `meta.pageSize`, and `meta.total` for pagination.

## Implemented in Current Backend Slice

- Auth: `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, password reset token groundwork, `GET /auth/me`, bearer-token auth, and httpOnly browser session cookies.
- Public property read: `GET /properties`, `GET /properties/featured`, `GET /properties/:id`.
- Agent property management: create, list own, update own, delete own, and confirm availability.
- Agent media: ordered listing galleries via image URLs, with cover-image compatibility.
- Inquiries: public inquiry creation and agent inquiry inbox.
- Inquiry triage: agents can mark inquiries as `NEW`, `CONTACTED`, `CLOSED`, or `ARCHIVED`.
- Favorites: authenticated saved listing list, add, and remove.
- Admin moderation: review queue, verify, reject, feature, unfeature, and hide.
