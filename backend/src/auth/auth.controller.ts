import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "./current-user.decorator";
import { AuthService } from "./auth.service";
import type { AuthUser } from "./auth.types";
import { LoginDto, RegisterDto } from "./dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { RateLimit } from "../rate-limit.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @RateLimit({ limit: 5, windowMs: 60_000 })
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @RateLimit({ limit: 8, windowMs: 60_000 })
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@CurrentUser() user: AuthUser) {
    return this.authService.me(user.sub);
  }
}
