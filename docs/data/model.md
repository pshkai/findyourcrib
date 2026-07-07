# Data Model

## Main Entities

- User: renter, agent, owner, or admin account.
- Property: listing with location, pricing, attributes, status, verification, and expiry.
- PropertyImage: ordered media for a listing.
- Amenity: normalized amenity catalog.
- Favorite: user saved listing.
- Inquiry: renter contact request routed to listing owner.

## Improvements From Previous Repo

- Use UUIDs instead of auto-incrementing integer public identifiers.
- Add `listingPurpose` and `rentFrequency` so the model can support rent and sale later.
- Add listing completeness fields and moderation fields instead of a single boolean verification flag.
- Keep media metadata but store actual media in object storage.
- Add pagination and search indexes from the beginning.

## Search Indexes

- `Property.status`, `Property.verificationStatus`, `Property.createdAt`.
- `Property.township`, `Property.province`, `Property.propertyType`.
- `Property.price`.
- PostGIS geography index for coordinates when location search graduates from MVP.
