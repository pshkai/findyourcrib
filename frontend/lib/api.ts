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
  description?: string;
  price: string | number;
  currency?: "THB";
  address?: string;
  township: string;
  province: string;
  propertyType: PropertyType;
  bedrooms: number | null;
  bathrooms: number | null;
  sizeSqm: string | number | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  nearestStation?: string | null;
  distanceToStation?: string | number | null;
  verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED";
  images?: Array<{ imageUrl: string; altText?: string | null; displayOrder?: number | null }>;
  agent?: {
    id: string;
    name: string;
    phoneNumber: string | null;
  };
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

export interface PropertyDetail extends PropertySummary {
  description: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  nearestStation: string | null;
  distanceToStation: number | null;
  images: Array<{ imageUrl: string; altText: string | null }>;
  agent: {
    id: string;
    name: string;
    phoneNumber: string | null;
  } | null;
}

function mapPropertyDetail(property: ApiProperty): PropertyDetail {
  return {
    ...mapProperty(property),
    description: property.description ?? "",
    address: property.address ?? "",
    latitude: toNumber(property.latitude),
    longitude: toNumber(property.longitude),
    nearestStation: property.nearestStation ?? null,
    distanceToStation: toNumber(property.distanceToStation),
    images: property.images?.map((image) => ({ imageUrl: image.imageUrl, altText: image.altText ?? null })) ?? [],
    agent: property.agent ?? null
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

export async function getPropertyDetail(id: string) {
  const fallback = featuredProperties.find((property) => property.id === id) ?? featuredProperties[0];

  try {
    const envelope = await request<ApiProperty>(`/properties/${id}`);
    return { property: mapPropertyDetail(envelope.data), isFallback: false };
  } catch {
    return {
      property: {
        ...fallback,
        description: "Demo listing shown while the backend API is not running.",
        address: `${fallback.township}, ${fallback.province}`,
        latitude: null,
        longitude: null,
        nearestStation: null,
        distanceToStation: null,
        images: fallback.coverImageUrl ? [{ imageUrl: fallback.coverImageUrl, altText: fallback.title }] : [],
        agent: { id: "demo-agent", name: "Demo Agent", phoneNumber: null }
      },
      isFallback: true
    };
  }
}
