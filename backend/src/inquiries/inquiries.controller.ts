import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import type { AuthUser } from "../auth/auth.types";
import { RateLimit } from "../rate-limit.decorator";
import { CreateInquiryDto, UpdateInquiryStatusDto } from "./dto";
import { InquiriesService } from "./inquiries.service";

@Controller()
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @RateLimit({ limit: 6, windowMs: 60_000 })
  @Post("inquiries")
  create(@Body() dto: CreateInquiryDto, @Req() request: { user?: AuthUser }) {
    return this.inquiriesService.create(dto, request.user?.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT, UserRole.OWNER, UserRole.ADMIN)
  @Get("agent/inquiries")
  findForAgent(@CurrentUser() user: AuthUser) {
    return this.inquiriesService.findForAgent(user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT, UserRole.OWNER, UserRole.ADMIN)
  @Patch("agent/inquiries/:id/status")
  updateStatus(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: UpdateInquiryStatusDto) {
    return this.inquiriesService.updateStatus(id, user.sub, dto.status);
  }
}
