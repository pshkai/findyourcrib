import type { ConfigService } from "@nestjs/config";
import { getJwtExpiresIn, getJwtSecret } from "./jwt-config";

describe("JWT config", () => {
  function config(values: Record<string, string | undefined>) {
    return {
      get: jest.fn((key: string) => values[key])
    } as unknown as ConfigService;
  }

  it("uses configured JWT secret", () => {
    expect(getJwtSecret(config({ JWT_SECRET: "real-secret", NODE_ENV: "production" }))).toBe("real-secret");
  });

  it("allows development fallback secret outside production", () => {
    expect(getJwtSecret(config({ NODE_ENV: "development" }))).toBe("development-secret");
  });

  it("fails fast when production has no JWT secret", () => {
    expect(() => getJwtSecret(config({ NODE_ENV: "production" }))).toThrow("JWT_SECRET is required in production");
  });

  it("uses configured expiry or one hour by default", () => {
    expect(getJwtExpiresIn(config({ JWT_EXPIRES_IN: "15m" }))).toBe("15m");
    expect(getJwtExpiresIn(config({}))).toBe("1h");
  });
});
