import { ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RateLimitGuard } from "./rate-limit.guard";

describe("RateLimitGuard", () => {
  function createContext(request: Record<string, unknown> = {}) {
    return {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          ip: "127.0.0.1",
          method: "POST",
          originalUrl: "/api/v1/auth/login",
          ...request
        })
      })
    } as unknown as ExecutionContext;
  }

  it("allows requests when no rate limit metadata is set", () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(undefined) };
    const guard = new RateLimitGuard(reflector as unknown as Reflector);

    expect(guard.canActivate(createContext())).toBe(true);
  });

  it("blocks requests above the configured limit", () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue({ limit: 2, windowMs: 60_000 }) };
    const guard = new RateLimitGuard(reflector as unknown as Reflector);
    const context = createContext();

    expect(guard.canActivate(context)).toBe(true);
    expect(guard.canActivate(context)).toBe(true);
    expect(() => guard.canActivate(context)).toThrow(HttpException);
  });

  it("tracks clients separately by forwarded ip", () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue({ limit: 1, windowMs: 60_000 }) };
    const guard = new RateLimitGuard(reflector as unknown as Reflector);

    expect(guard.canActivate(createContext({ headers: { "x-forwarded-for": "203.0.113.1, 10.0.0.1" } }))).toBe(true);
    expect(guard.canActivate(createContext({ headers: { "x-forwarded-for": "203.0.113.2" } }))).toBe(true);
    expect(() => guard.canActivate(createContext({ headers: { "x-forwarded-for": "203.0.113.1" } }))).toThrow(HttpException);
  });

  it("resets a bucket after the configured window", () => {
    jest.spyOn(Date, "now").mockReturnValueOnce(1_000).mockReturnValueOnce(1_500).mockReturnValueOnce(2_100);
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue({ limit: 1, windowMs: 1_000 }) };
    const guard = new RateLimitGuard(reflector as unknown as Reflector);
    const context = createContext();

    expect(guard.canActivate(context)).toBe(true);
    expect(() => guard.canActivate(context)).toThrow(HttpException);
    expect(guard.canActivate(context)).toBe(true);
  });

  it("uses HTTP 429 for blocked requests", () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue({ limit: 1, windowMs: 60_000 }) };
    const guard = new RateLimitGuard(reflector as unknown as Reflector);
    const context = createContext();
    guard.canActivate(context);

    try {
      guard.canActivate(context);
      throw new Error("Expected guard to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
    }
  });
});
