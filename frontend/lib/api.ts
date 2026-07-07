import type { PropertySearchParams, PropertySummary, PropertyType } from "@findyourcrib/shared";
import { featuredProperties } from "./mock-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

interface ApiEnvelope<T> {
  data: T;
  meta?: Record<string, unknown>;
  error?: unknown;
}

interface ApiProperty {
  id: string;
  title: string;
  price: string | number;
  currency?: "THB";
  township: string;
  province: string;
  propertyType: PropertyType;
  bedrooms: number | null;
  bathrooms: number | null;
  sizeSqm: string | number | null;
  verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED";
  images?: Array<{ imageUrl: string; displayOrder?: number | null }>;
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(`${API_BASE_URL}${path}`);

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

async function request<T>(path: string, params?: Record<string, string | number | undefined>) {
  const response = await fetch(buildUrl(path, params), {
    cache: "no-store",
    headers: { Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as ApiEnvelope<T>;
}

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  return typeof value === "number" ? value : Number(value);
}

function mapProperty(property: ApiProperty): PropertySummary {
  return {
    id: property.id,
    title: property.title,
    price: toNumber(property.price) ?? 0,
    currency: property.currency ?? "THB",
    township: property.township,
    province: property.province,
    propertyType: property.propertyType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    sizeSqm: toNumber(property.sizeSqm),
    isVerified: property.verificationStatus === "VERIFIED",
    coverImageUrl: property.images?.[0]?.imageUrl ?? null
  };
}

export async function getFeaturedProperties() {
  try {
    const envelope = await request<ApiProperty[]>("/properties/featured");
    return envelope.data.map(mapProperty);
  } catch {
    return featuredProperties;
  }
}

export async function searchProperties(params: PropertySearchParams) {
  try {
    const envelope = await request<ApiProperty[]>("/properties", {
      query: params.query,
      township: params.township,
      province: params.province,
      propertyType: params.propertyType,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      bedrooms: params.bedrooms,
      bathrooms: params.bathrooms,
      page: params.page,
      pageSize: params.pageSize
    });
    return {
      properties: envelope.data.map(mapProperty),
      meta: envelope.meta ?? {}
    };
  } catch {
    return {
      properties: featuredProperties,
      meta: { fallback: true }
    };
  }
}
