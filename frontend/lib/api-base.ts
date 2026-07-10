const DEFAULT_API_BASE_URL = "http://localhost:4000/api/v1";

export const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE_URL);

function normalizeApiBaseUrl(value: string) {
  const trimmedValue = value.trim().replace(/\/$/, "");

  if (trimmedValue.endsWith("/api/v1")) {
    return trimmedValue;
  }

  return `${trimmedValue}/api/v1`;
}
