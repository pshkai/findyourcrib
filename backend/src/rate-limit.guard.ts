import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RATE_LIMIT_KEY, type RateLimitOptions } from "./rate-limit.decorator";

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

interface RequestLike {
  headers?: Record<string, string | string[] | undefined>;
  ip?: string;
  method?: string;
  originalUrl?: string;
  socket?: {
    remoteAddress?: string;
  };
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly buckets = new Map<string, RateLimitBucket>();

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const options = this.reflector.getAllAndOverride<RateLimitOptions | undefined>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestLike>();
    const now = Date.now();
    const key = this.keyFor(request);
    const bucket = this.buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + options.windowMs });
      this.pruneExpired(now);
      return true;
    }

    if (bucket.count >= options.limit) {
      throw new HttpException("Too many requests. Please try again later.", HttpStatus.TOO_MANY_REQUESTS);
    }

    bucket.count += 1;
    return true;
  }

  private keyFor(request: RequestLike) {
    return [this.clientIp(request), request.method ?? "UNKNOWN", request.originalUrl ?? "unknown"].join(":");
  }

  private clientIp(request: RequestLike) {
    const forwardedFor = request.headers?.["x-forwarded-for"];
    const firstForwardedFor = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;

    return firstForwardedFor?.split(",")[0]?.trim() || request.ip || request.socket?.remoteAddress || "unknown";
  }

  private pruneExpired(now: number) {
    for (const [key, bucket] of this.buckets.entries()) {
      if (bucket.resetAt <= now) {
        this.buckets.delete(key);
      }
    }
  }
}
