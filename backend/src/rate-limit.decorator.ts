import { SetMetadata } from "@nestjs/common";

export const RATE_LIMIT_KEY = "findyourcrib:rate-limit";

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export function RateLimit(options: RateLimitOptions) {
  return SetMetadata(RATE_LIMIT_KEY, options);
}
