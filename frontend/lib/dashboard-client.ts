"use client";

import type { PropertySummary, PropertyType } from "@findyourcrib/shared";
import { authorizedRequest } from "./auth-client";

interface Envelope<T> {
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
  status?: string;
  verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED";
  images?: Array<{ imageUrl: string }>;
  _count?: {
    inquiries?: number;
    favorites?: number;
  };
}

export interface InquirySummary {
  id: string;
  message: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  createdAt: string;
  property: {
    id: string;
    title: string;
    township: string;
    province: string;
  };
}

export interface FavoriteSummary {
  propertyId: string;
  createdAt: string;
  property: PropertySummary;
}

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  return typeof value === "number" ? value : Number(value);
}

function mapProperty(property: ApiProperty): PropertySummary & {
  description?: string;
  address?: string;
  status?: string;
  verificationStatus?: string;
  inquiryCount?: number;
  favoriteCount?: number;
} {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    price: toNumber(property.price) ?? 0,
    currency: property.currency ?? "THB",
    address: property.address,
    township: property.township,
    province: property.province,
    propertyType: property.propertyType,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    sizeSqm: toNumber(property.sizeSqm),
    isVerified: property.verificationStatus === "VERIFIED",
    coverImageUrl: property.images?.[0]?.imageUrl ?? null,
    status: property.status,
    verificationStatus: property.verificationStatus,
    inquiryCount: property._count?.inquiries,
    favoriteCount: property._count?.favorites
  };
}

export async function getAgentListings() {
  const envelope = await authorizedRequest<Envelope<ApiProperty[]>>("/agent/properties");
  return envelope.data.map(mapProperty);
}

export async function getAgentListing(propertyId: string) {
  const envelope = await authorizedRequest<Envelope<ApiProperty>>(`/agent/properties/${propertyId}`);
  return mapProperty(envelope.data);
}

export async function getAgentInquiries() {
  const envelope = await authorizedRequest<Envelope<InquirySummary[]>>("/agent/inquiries");
  return envelope.data;
}

export async function getFavorites() {
  const envelope = await authorizedRequest<Envelope<Array<{ propertyId: string; createdAt: string; property: ApiProperty }>>>("/favorites");
  return envelope.data.map((favorite) => ({
    propertyId: favorite.propertyId,
    createdAt: favorite.createdAt,
    property: mapProperty(favorite.property)
  }));
}

export async function removeFavorite(propertyId: string) {
  await authorizedRequest(`/favorites/${propertyId}`, { method: "DELETE" });
}

export async function confirmListingAvailability(propertyId: string) {
  const envelope = await authorizedRequest<Envelope<ApiProperty>>(`/agent/properties/${propertyId}/confirm-availability`, {
    method: "POST"
  });

  return mapProperty(envelope.data);
}

export async function deleteListing(propertyId: string) {
  await authorizedRequest(`/agent/properties/${propertyId}`, { method: "DELETE" });
}

export async function createListing(payload: {
  title: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  sizeSqm?: number;
  address: string;
  township: string;
  province: string;
  coverImageUrl?: string;
}) {
  const envelope = await authorizedRequest<Envelope<ApiProperty>>("/agent/properties", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return mapProperty(envelope.data);
}

export async function updateListing(
  propertyId: string,
  payload: {
    title: string;
    description: string;
    price: number;
    propertyType: PropertyType;
    bedrooms?: number;
    bathrooms?: number;
    sizeSqm?: number;
    address: string;
    township: string;
    province: string;
    coverImageUrl?: string;
  }
) {
  const envelope = await authorizedRequest<Envelope<ApiProperty>>(`/agent/properties/${propertyId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });

  return mapProperty(envelope.data);
}
