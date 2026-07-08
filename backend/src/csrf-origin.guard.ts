import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

interface RequestLike {
  headers?: Record<string, string | string[] | undefined>;
  method?: string;
}

@Injectable()
export class CsrfOriginGuard implements CanActivate {
  private readonly allowedOrigins: Set<string>;

  constructor(configService: ConfigService) {
    this.allowedOrigins = new Set(
      configService
        .getOrThrow<string>("FRONTEND_URL")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    );
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestLike>();
    const method = request.method?.toUpperCase() ?? "GET";

    if (SAFE_METHODS.has(method)) {
      return true;
    }

    const origin = this.headerValue(request, "origin");

    if (!origin) {
      return true;
    }

    if (this.allowedOrigins.has(origin)) {
      return true;
    }

    throw new ForbiddenException("Request origin is not allowed");
  }

  private headerValue(request: RequestLike, key: string) {
    const value = request.headers?.[key];
    return Array.isArray(value) ? value[0] : value;
  }
}
