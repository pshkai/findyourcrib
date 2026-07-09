"use client";

import { throwApiError } from "./api-error";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function createInquiry(payload: {
  propertyId: string;
  message: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/inquiries`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    await throwApiError(response, "Unable to send inquiry");
  }

  return response.json();
}
