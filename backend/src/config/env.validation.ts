const DEFAULT_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/findyourcrib";
const DEFAULT_FRONTEND_URL = "http://localhost:3000,https://findyourcrib.vercel.app";
const DEFAULT_JWT_EXPIRES_IN = "1h";
const DEFAULT_NODE_ENV = "development";
const DEFAULT_PORT = 4000;

type EnvInput = Record<string, unknown>;

function readString(config: EnvInput, key: string) {
  const value = config[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function assertUrl(value: string, key: string) {
  try {
    new URL(value);
  } catch {
    throw new Error(`${key} must be a valid URL`);
  }
}

function parsePort(value: string | undefined) {
  if (!value) {
    return DEFAULT_PORT;
  }

  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return port;
}

export function validateBackendEnv(config: EnvInput) {
  const nodeEnv = readString(config, "NODE_ENV") ?? DEFAULT_NODE_ENV;
  const isProduction = nodeEnv === "production";
  const databaseUrl = readString(config, "DATABASE_URL") ?? (isProduction ? undefined : DEFAULT_DATABASE_URL);
  const frontendUrl = readString(config, "FRONTEND_URL") ?? DEFAULT_FRONTEND_URL;
  const jwtSecret = readString(config, "JWT_SECRET");
  const jwtExpiresIn = readString(config, "JWT_EXPIRES_IN") ?? DEFAULT_JWT_EXPIRES_IN;
  const port = parsePort(readString(config, "PORT"));

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required in production");
  }

  assertUrl(databaseUrl, "DATABASE_URL");
  for (const origin of frontendUrl.split(",").map((value) => value.trim()).filter(Boolean)) {
    assertUrl(origin, "FRONTEND_URL");
  }

  if (isProduction && (!jwtSecret || jwtSecret === "replace-me")) {
    throw new Error("JWT_SECRET must be set to a private value in production");
  }

  return {
    ...config,
    DATABASE_URL: databaseUrl,
    FRONTEND_URL: frontendUrl,
    JWT_EXPIRES_IN: jwtExpiresIn,
    JWT_SECRET: jwtSecret,
    NODE_ENV: nodeEnv,
    PORT: port
  };
}
