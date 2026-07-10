"use client";

import { throwApiError } from "./api-error";
import { API_BASE_URL } from "./api-base";

const TOKEN_KEY = "findyourcrib.accessToken";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "RENTER" | "AGENT" | "OWNER" | "ADMIN";
}

interface AuthResponse {
  data: {
    accessToken: string;
    user: AuthUser;
  };
  error: unknown;
}

interface MeResponse {
  data: AuthUser | null;
  error: unknown;
}

interface ForgotPasswordResponse {
  data: null;
  meta?: {
    resetToken?: string;
  };
  error: unknown;
}

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function clearAccessToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
}

export async function authorizedRequest<T>(path: string, init?: RequestInit) {
  const token = getAccessToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers
    }
  });

  if (!response.ok) {
    await throwApiError(response, `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getCurrentUser() {
  const envelope = await authorizedRequest<MeResponse>("/auth/me");
  return envelope.data;
}

async function authRequest(path: string, payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    await throwApiError(response, "Authentication failed");
  }

  const envelope = (await response.json()) as AuthResponse;
  clearAccessToken();
  return envelope.data.user;
}

export function login(payload: { email: string; password: string }) {
  return authRequest("/auth/login", payload);
}

export function register(payload: {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: "RENTER" | "AGENT" | "OWNER";
}) {
  return authRequest("/auth/register", payload);
}

export async function forgotPassword(payload: { email: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    await throwApiError(response, "Unable to request password reset");
  }

  return (await response.json()) as ForgotPasswordResponse;
}

export async function resetPassword(payload: { token: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    await throwApiError(response, "Unable to reset password");
  }
}

export async function logoutRequest() {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json"
    }
  });
  clearAccessToken();
}
