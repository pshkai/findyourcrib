import { Logger } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { RequestLoggerMiddleware } from "./request-logger.middleware";

describe("RequestLoggerMiddleware", () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, "error").mockImplementation();
    jest.spyOn(Logger.prototype, "log").mockImplementation();
    jest.spyOn(Logger.prototype, "warn").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function runMiddleware(statusCode: number) {
    const middleware = new RequestLoggerMiddleware();
    let finishHandler: (() => void) | undefined;
    const request = {
      headers: { "x-forwarded-for": "203.0.113.10, 10.0.0.1" },
      ip: "127.0.0.1",
      method: "GET",
      originalUrl: "/api/v1/health",
      socket: {}
    } as unknown as Request;
    const response = {
      on: jest.fn((event: string, handler: () => void) => {
        if (event === "finish") {
          finishHandler = handler;
        }
      }),
      statusCode
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    middleware.use(request, response, next);
    finishHandler?.();

    return next;
  }

  it("logs successful responses", () => {
    const next = runMiddleware(200);

    expect(next).toHaveBeenCalled();
    expect(Logger.prototype.log).toHaveBeenCalledWith(expect.stringContaining("GET /api/v1/health 200"));
  });

  it("warns for client errors", () => {
    runMiddleware(404);

    expect(Logger.prototype.warn).toHaveBeenCalledWith(expect.stringContaining("GET /api/v1/health 404"));
  });

  it("errors for server errors", () => {
    runMiddleware(500);

    expect(Logger.prototype.error).toHaveBeenCalledWith(expect.stringContaining("GET /api/v1/health 500"));
  });
});
