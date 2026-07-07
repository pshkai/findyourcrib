import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { PropertiesService } from "./properties.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("admin/properties")
export class AdminPropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get("review")
  reviewQueue() {
    return this.propertiesService.reviewQueue();
  }

  @Post(":id/verify")
  verify(@Param("id") id: string) {
    return this.propertiesService.setVerification(id, "VERIFIED");
  }

  @Post(":id/reject")
  reject(@Param("id") id: string) {
    return this.propertiesService.setVerification(id, "REJECTED");
  }

  @Post(":id/feature")
  feature(@Param("id") id: string) {
    return this.propertiesService.setFeatured(id, true);
  }

  @Post(":id/unfeature")
  unfeature(@Param("id") id: string) {
    return this.propertiesService.setFeatured(id, false);
  }

  @Post(":id/hide")
  hide(@Param("id") id: string) {
    return this.propertiesService.hide(id);
  }
}
