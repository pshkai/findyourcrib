import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import type { AuthUser } from "../auth/auth.types";
import { CreatePropertyDto, UpdatePropertyDto } from "./dto";
import { PropertiesService } from "./properties.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.AGENT, UserRole.OWNER, UserRole.ADMIN)
@Controller("agent/properties")
export class AgentPropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  mine(@CurrentUser() user: AuthUser) {
    return this.propertiesService.findMine(user.sub);
  }

  @Get(":id")
  findOwned(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.propertiesService.findOwned(id, user.sub);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePropertyDto) {
    return this.propertiesService.create(user.sub, dto);
  }

  @Patch(":id")
  update(@CurrentUser() user: AuthUser, @Param("id") id: string, @Body() dto: UpdatePropertyDto) {
    return this.propertiesService.updateOwned(id, user.sub, dto);
  }

  @Delete(":id")
  delete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.propertiesService.deleteOwned(id, user.sub);
  }

  @Post(":id/confirm-availability")
  confirmAvailability(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.propertiesService.confirmAvailability(id, user.sub);
  }
}
