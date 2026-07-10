"use client";

import { throwApiError } from "./api-error";
import { API_BASE_URL } from "./api-base";

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
