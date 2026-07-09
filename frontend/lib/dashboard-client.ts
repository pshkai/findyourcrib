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
  images?: Array<{ imageUrl: string; altText?: string | null }>;
  _count?: {
    inquiries?: number;
    favorites?: number;
  };
  agent?: {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string | null;
  };
}

export interface InquirySummary {
  id: string;
  message: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  status: "NEW" | "CONTACTED" | "CLOSED" | "ARCHIVED";
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

export type AdminReviewListing = ReturnType<typeof mapProperty> & {
  agent?: {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string | null;
  };
};

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
    imageUrls: property.images?.map((image) => image.imageUrl) ?? [],
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

export async function updateInquiryStatus(inquiryId: string, status: InquirySummary["status"]) {
  const envelope = await authorizedRequest<Envelope<InquirySummary>>(`/agent/inquiries/${inquiryId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });

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

export async function addFavorite(propertyId: string) {
  await authorizedRequest(`/favorites/${propertyId}`, { method: "POST" });
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

interface MediaUploadUrl {
  contentType: "image/jpeg" | "image/png" | "image/webp";
  path: string;
  publicUrl: string;
  signedUrl: string;
}

export async function uploadPropertyImage(file: File) {
  const envelope = await authorizedRequest<Envelope<MediaUploadUrl>>("/agent/media/upload-url", {
    method: "POST",
    body: JSON.stringify({
      contentType: file.type,
      fileName: file.name
    })
  });

  const uploadBody = new FormData();
  uploadBody.append("cacheControl", "3600");
  uploadBody.append("", file);

  const response = await fetch(envelope.data.signedUrl, {
    method: "PUT",
    headers: {
      "x-upsert": "false"
    },
    body: uploadBody
  });

  if (!response.ok) {
    throw new Error("Unable to upload image");
  }

  return envelope.data.publicUrl;
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
  images?: Array<{ imageUrl: string; altText?: string }>;
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
    images?: Array<{ imageUrl: string; altText?: string }>;
  }
) {
  const envelope = await authorizedRequest<Envelope<ApiProperty>>(`/agent/properties/${propertyId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });

  return mapProperty(envelope.data);
}

function mapAdminReviewListing(property: ApiProperty): AdminReviewListing {
  return {
    ...mapProperty(property),
    agent: property.agent
  };
}

export async function getAdminReviewQueue() {
  const envelope = await authorizedRequest<Envelope<ApiProperty[]>>("/admin/properties/review");
  return envelope.data.map(mapAdminReviewListing);
}

export async function verifyAdminListing(propertyId: string) {
  const envelope = await authorizedRequest<Envelope<ApiProperty>>(`/admin/properties/${propertyId}/verify`, { method: "POST" });
  return mapAdminReviewListing(envelope.data);
}

export async function rejectAdminListing(propertyId: string) {
  const envelope = await authorizedRequest<Envelope<ApiProperty>>(`/admin/properties/${propertyId}/reject`, { method: "POST" });
  return mapAdminReviewListing(envelope.data);
}

export async function featureAdminListing(propertyId: string) {
  const envelope = await authorizedRequest<Envelope<ApiProperty>>(`/admin/properties/${propertyId}/feature`, { method: "POST" });
  return mapAdminReviewListing(envelope.data);
}

export async function hideAdminListing(propertyId: string) {
  const envelope = await authorizedRequest<Envelope<ApiProperty>>(`/admin/properties/${propertyId}/hide`, { method: "POST" });
  return mapAdminReviewListing(envelope.data);
}
