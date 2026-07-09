const DEFAULT_DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/findyourcrib";
const DEFAULT_FRONTEND_URL = "http://localhost:3000,https://findyourcrib.vercel.app";
const DEFAULT_JWT_EXPIRES_IN = "1h";
const DEFAULT_NODE_ENV = "development";
const DEFAULT_PORT = 4000;
const DEFAULT_SMTP_PORT = 587;
const DEFAULT_SMTP_SECURE = false;

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

function parseInteger(value: string | undefined, fallback: number, key: string) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(`${key} must be an integer between 1 and 65535`);
  }

  return parsed;
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (!value) {
    return fallback;
  }

  if (["true", "1"].includes(value.toLowerCase())) {
    return true;
  }

  if (["false", "0"].includes(value.toLowerCase())) {
    return false;
  }

  throw new Error("SMTP_SECURE must be true or false");
}

export function validateBackendEnv(config: EnvInput) {
  const nodeEnv = readString(config, "NODE_ENV") ?? DEFAULT_NODE_ENV;
  const isProduction = nodeEnv === "production";
  const databaseUrl = readString(config, "DATABASE_URL") ?? (isProduction ? undefined : DEFAULT_DATABASE_URL);
  const frontendUrl = readString(config, "FRONTEND_URL") ?? DEFAULT_FRONTEND_URL;
  const jwtSecret = readString(config, "JWT_SECRET");
  const jwtExpiresIn = readString(config, "JWT_EXPIRES_IN") ?? DEFAULT_JWT_EXPIRES_IN;
  const port = parsePort(readString(config, "PORT"));
  const smtpHost = readString(config, "SMTP_HOST");
  const smtpFrom = readString(config, "SMTP_FROM");
  const smtpPort = parseInteger(readString(config, "SMTP_PORT"), DEFAULT_SMTP_PORT, "SMTP_PORT");
  const smtpSecure = parseBoolean(readString(config, "SMTP_SECURE"), DEFAULT_SMTP_SECURE);
  const supabaseUrl = readString(config, "SUPABASE_URL");
  const supabaseServiceRoleKey = readString(config, "SUPABASE_SERVICE_ROLE_KEY");
  const supabaseStorageBucket = readString(config, "SUPABASE_STORAGE_BUCKET");

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

  if (isProduction && (!smtpHost || !smtpFrom)) {
    throw new Error("SMTP_HOST and SMTP_FROM are required in production for password reset emails");
  }

  if (supabaseUrl) {
    assertUrl(supabaseUrl, "SUPABASE_URL");
  }

  if (isProduction && (!supabaseUrl || !supabaseServiceRoleKey || !supabaseStorageBucket)) {
    throw new Error("SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET are required in production");
  }

  return {
    ...config,
    DATABASE_URL: databaseUrl,
    FRONTEND_URL: frontendUrl,
    JWT_EXPIRES_IN: jwtExpiresIn,
    JWT_SECRET: jwtSecret,
    NODE_ENV: nodeEnv,
    PORT: port,
    SMTP_FROM: smtpFrom,
    SMTP_HOST: smtpHost,
    SMTP_PASS: readString(config, "SMTP_PASS"),
    SMTP_PORT: smtpPort,
    SMTP_SECURE: smtpSecure,
    SMTP_USER: readString(config, "SMTP_USER"),
    SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKey,
    SUPABASE_STORAGE_BUCKET: supabaseStorageBucket,
    SUPABASE_URL: supabaseUrl
  };
}
