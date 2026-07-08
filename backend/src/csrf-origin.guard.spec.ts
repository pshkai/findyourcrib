import { ConfigService } from "@nestjs/config";
import { ForbiddenException, type ExecutionContext } from "@nestjs/common";
import { CsrfOriginGuard } from "./csrf-origin.guard";

describe("CsrfOriginGuard", () => {
  function createGuard() {
    return new CsrfOriginGuard({
      getOrThrow: jest.fn().mockReturnValue("http://localhost:3000,https://findyourcrib.vercel.app")
    } as unknown as ConfigService);
  }

  function contextFor(request: { method?: string; headers?: Record<string, string | undefined> }) {
    return {
      switchToHttp: () => ({
        getRequest: () => request
      })
    } as unknown as ExecutionContext;
  }

  it("allows safe methods without checking origin", () => {
    const guard = createGuard();

    expect(guard.canActivate(contextFor({ method: "GET", headers: { origin: "https://evil.example" } }))).toBe(true);
  });

  it("allows mutating browser requests from configured frontend origins", () => {
    const guard = createGuard();

    expect(guard.canActivate(contextFor({ method: "POST", headers: { origin: "https://findyourcrib.vercel.app" } }))).toBe(true);
  });

  it("allows non-browser API clients that do not send an origin header", () => {
    const guard = createGuard();

    expect(guard.canActivate(contextFor({ method: "PATCH", headers: {} }))).toBe(true);
  });

  it("rejects mutating browser requests from unknown origins", () => {
    const guard = createGuard();

    expect(() => guard.canActivate(contextFor({ method: "DELETE", headers: { origin: "https://evil.example" } }))).toThrow(
      ForbiddenException
    );
  });
});
