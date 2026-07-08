import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { CurrentUser } from "./current-user.decorator";
import { AuthService } from "./auth.service";
import type { AuthUser } from "./auth.types";
import { clearAuthCookie, setAuthCookie } from "./auth-cookie";
import { LoginDto, RegisterDto } from "./dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RateLimit } from "../rate-limit.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @RateLimit({ limit: 5, windowMs: 60_000 })
  @Post("register")
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const session = await this.authService.register(dto);
    setAuthCookie(response, session.data.accessToken);
    return session;
  }

  @RateLimit({ limit: 8, windowMs: 60_000 })
  @Post("login")
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const session = await this.authService.login(dto);
    setAuthCookie(response, session.data.accessToken);
    return session;
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) response: Response) {
    clearAuthCookie(response);
    return { data: null, meta: {}, error: null };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@CurrentUser() user: AuthUser) {
    return this.authService.me(user.sub);
  }
}
