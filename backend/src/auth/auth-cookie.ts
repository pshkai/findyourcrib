import type { Request, Response } from "express";

export const AUTH_COOKIE_NAME = "fyc_session";

const ONE_HOUR_MS = 60 * 60 * 1000;

export function authCookieOptions(nodeEnv = process.env.NODE_ENV) {
  const isProduction = nodeEnv === "production";

  return {
    httpOnly: true,
    maxAge: ONE_HOUR_MS,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction
  } as const;
}

export function setAuthCookie(response: Response, accessToken: string, nodeEnv = process.env.NODE_ENV) {
  response.cookie(AUTH_COOKIE_NAME, accessToken, authCookieOptions(nodeEnv));
}

export function clearAuthCookie(response: Response, nodeEnv = process.env.NODE_ENV) {
  response.clearCookie(AUTH_COOKIE_NAME, {
    ...authCookieOptions(nodeEnv),
    maxAge: undefined
  });
}

export function extractAuthCookie(request: Request) {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const sessionCookie = cookies.find((cookie) => cookie.startsWith(`${AUTH_COOKIE_NAME}=`));

  if (!sessionCookie) {
    return null;
  }

  return decodeURIComponent(sessionCookie.slice(AUTH_COOKIE_NAME.length + 1));
}
