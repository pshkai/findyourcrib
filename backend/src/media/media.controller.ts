import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { CurrentUser } from "../auth/current-user.decorator";
import type { AuthUser } from "../auth/auth.types";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { CreateUploadUrlDto } from "./dto";
import { MediaService } from "./media.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.AGENT, UserRole.OWNER, UserRole.ADMIN)
@Controller("agent/media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("upload-url")
  createUploadUrl(@CurrentUser() user: AuthUser, @Body() dto: CreateUploadUrlDto) {
    return this.mediaService.createSignedUploadUrl(user.sub, dto);
  }
}
