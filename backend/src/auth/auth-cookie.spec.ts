import type { Request, Response } from "express";
import { AUTH_COOKIE_NAME, authCookieOptions, clearAuthCookie, extractAuthCookie, setAuthCookie } from "./auth-cookie";

describe("auth-cookie", () => {
  it("uses secure cross-site cookies in production", () => {
    expect(authCookieOptions("production")).toMatchObject({
      httpOnly: true,
      sameSite: "none",
      secure: true
    });
  });

  it("uses lax cookies for local development", () => {
    expect(authCookieOptions("development")).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });
  });

  it("sets and clears the auth cookie", () => {
    const response = {
      clearCookie: jest.fn(),
      cookie: jest.fn()
    } as unknown as Response;

    setAuthCookie(response, "signed-token", "production");
    clearAuthCookie(response, "production");

    expect(response.cookie).toHaveBeenCalledWith(AUTH_COOKIE_NAME, "signed-token", expect.objectContaining({ httpOnly: true }));
    expect(response.clearCookie).toHaveBeenCalledWith(AUTH_COOKIE_NAME, expect.objectContaining({ secure: true }));
  });

  it("extracts an encoded auth cookie from request headers", () => {
    const request = {
      headers: {
        cookie: `theme=dark; ${AUTH_COOKIE_NAME}=signed%20token; other=value`
      }
    } as unknown as Request;

    expect(extractAuthCookie(request)).toBe("signed token");
  });

  it("returns null when the auth cookie is missing", () => {
    const request = {
      headers: {
        cookie: "theme=dark"
      }
    } as unknown as Request;

    expect(extractAuthCookie(request)).toBeNull();
  });
});
