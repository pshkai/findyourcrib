"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
const TOKEN_KEY = "findyourcrib.accessToken";

interface AuthResponse {
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
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
  window.localStorage.removeItem(TOKEN_KEY);
}

async function authRequest(path: string, payload: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Authentication failed");
  }

  const envelope = (await response.json()) as AuthResponse;
  window.localStorage.setItem(TOKEN_KEY, envelope.data.accessToken);
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
