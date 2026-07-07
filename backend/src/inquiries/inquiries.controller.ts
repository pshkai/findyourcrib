import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import type { AuthUser } from "../auth/auth.types";
import { CreateInquiryDto } from "./dto";
import { InquiriesService } from "./inquiries.service";

@Controller()
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

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
}
