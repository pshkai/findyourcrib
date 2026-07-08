import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { extractAuthCookie } from "./auth-cookie";
import type { AuthUser } from "./auth.types";
import { getJwtSecret } from "./jwt-config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), extractAuthCookie]),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(configService)
    });
  }

  validate(payload: AuthUser): AuthUser {
    return payload;
  }
}
