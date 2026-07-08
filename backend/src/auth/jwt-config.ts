import type { ConfigService } from "@nestjs/config";

const DEFAULT_DEVELOPMENT_SECRET = "development-secret";
const DEFAULT_EXPIRES_IN = "1h";

export function getJwtSecret(configService: ConfigService) {
  const secret = configService.get<string>("JWT_SECRET");

  if (secret) {
    return secret;
  }

  if (configService.get<string>("NODE_ENV") === "production") {
    throw new Error("JWT_SECRET is required in production");
  }

  return DEFAULT_DEVELOPMENT_SECRET;
}

export function getJwtExpiresIn(configService: ConfigService) {
  return configService.get<string>("JWT_EXPIRES_IN") ?? DEFAULT_EXPIRES_IN;
}
