export type UserRole = "RENTER" | "AGENT" | "OWNER" | "ADMIN";

export type PropertyStatus = "DRAFT" | "AVAILABLE" | "BOOKED" | "HIDDEN" | "EXPIRED";

export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type PropertyType = "CONDO" | "APARTMENT" | "HOUSE" | "VILLA" | "SERVICED_APARTMENT";

export type PropertySort = "newest" | "price_asc" | "price_desc" | "featured";

export interface PropertySearchParams {
  query?: string;
  township?: string;
  province?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  sort?: PropertySort;
  page?: number;
  pageSize?: number;
}

export interface PropertySummary {
  id: string;
  title: string;
  price: number;
  currency: "THB";
  township: string;
  province: string;
  propertyType: PropertyType;
  bedrooms: number | null;
  bathrooms: number | null;
  sizeSqm: number | null;
  isVerified: boolean;
  coverImageUrl: string | null;
  imageUrls?: string[];
}
