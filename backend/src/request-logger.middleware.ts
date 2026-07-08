import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(request: Request, response: Response, next: NextFunction) {
    const startedAt = Date.now();

    response.on("finish", () => {
      const durationMs = Date.now() - startedAt;
      const message = [
        request.method,
        request.originalUrl,
        response.statusCode,
        `${durationMs}ms`,
        this.clientIp(request)
      ].join(" ");

      if (response.statusCode >= 500) {
        this.logger.error(message);
      } else if (response.statusCode >= 400) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }

  private clientIp(request: Request) {
    const forwardedFor = request.headers["x-forwarded-for"];
    const firstForwardedFor = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;

    return firstForwardedFor?.split(",")[0]?.trim() || request.ip || request.socket.remoteAddress || "unknown";
  }
}
