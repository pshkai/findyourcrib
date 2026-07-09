import { validateBackendEnv } from "./env.validation";

describe("validateBackendEnv", () => {
  it("uses local defaults outside production", () => {
    expect(validateBackendEnv({})).toMatchObject({
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/findyourcrib",
      FRONTEND_URL: "http://localhost:3000,https://findyourcrib.vercel.app",
      JWT_EXPIRES_IN: "1h",
      NODE_ENV: "development",
      PORT: 4000,
      SMTP_PORT: 587,
      SMTP_SECURE: false
    });
  });

  it("accepts production settings", () => {
    expect(
      validateBackendEnv({
        DATABASE_URL: "postgresql://postgres:postgres@example.com:5432/findyourcrib",
        FRONTEND_URL: "https://findyourcrib.vercel.app,https://www.findyourcrib.com",
        JWT_EXPIRES_IN: "30m",
        JWT_SECRET: "private-production-secret",
        NODE_ENV: "production",
        PORT: "8080",
        SMTP_FROM: "FindYourCrib <support@findyourcrib.test>",
        SMTP_HOST: "smtp.example.com",
        SMTP_PORT: "465",
        SMTP_SECURE: "true"
      })
    ).toMatchObject({
      JWT_EXPIRES_IN: "30m",
      JWT_SECRET: "private-production-secret",
      NODE_ENV: "production",
      PORT: 8080,
      SMTP_FROM: "FindYourCrib <support@findyourcrib.test>",
      SMTP_HOST: "smtp.example.com",
      SMTP_PORT: 465,
      SMTP_SECURE: true
    });
  });

  it("requires a database URL in production", () => {
    expect(() =>
      validateBackendEnv({
        JWT_SECRET: "private-production-secret",
        NODE_ENV: "production"
      })
    ).toThrow("DATABASE_URL is required in production");
  });

  it("rejects placeholder production JWT secrets", () => {
    expect(() =>
      validateBackendEnv({
        DATABASE_URL: "postgresql://postgres:postgres@example.com:5432/findyourcrib",
        SMTP_FROM: "FindYourCrib <support@findyourcrib.test>",
        SMTP_HOST: "smtp.example.com",
        JWT_SECRET: "replace-me",
        NODE_ENV: "production"
      })
    ).toThrow("JWT_SECRET must be set to a private value in production");
  });

  it("requires SMTP delivery settings in production", () => {
    expect(() =>
      validateBackendEnv({
        DATABASE_URL: "postgresql://postgres:postgres@example.com:5432/findyourcrib",
        JWT_SECRET: "private-production-secret",
        NODE_ENV: "production"
      })
    ).toThrow("SMTP_HOST and SMTP_FROM are required in production for password reset emails");
  });

  it("rejects invalid URLs and ports", () => {
    expect(() => validateBackendEnv({ DATABASE_URL: "not-a-url" })).toThrow("DATABASE_URL must be a valid URL");
    expect(() => validateBackendEnv({ FRONTEND_URL: "not-a-url" })).toThrow("FRONTEND_URL must be a valid URL");
    expect(() => validateBackendEnv({ PORT: "70000" })).toThrow("PORT must be an integer between 1 and 65535");
    expect(() => validateBackendEnv({ SMTP_PORT: "70000" })).toThrow("SMTP_PORT must be an integer between 1 and 65535");
    expect(() => validateBackendEnv({ SMTP_SECURE: "maybe" })).toThrow("SMTP_SECURE must be true or false");
  });
});
