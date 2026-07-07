import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { AuthUser } from "../auth/auth.types";
import { FavoritesService } from "./favorites.service";

@UseGuards(JwtAuthGuard)
@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findMine(@CurrentUser() user: AuthUser) {
    return this.favoritesService.findMine(user.sub);
  }

  @Post(":propertyId")
  add(@CurrentUser() user: AuthUser, @Param("propertyId") propertyId: string) {
    return this.favoritesService.add(user.sub, propertyId);
  }

  @Delete(":propertyId")
  remove(@CurrentUser() user: AuthUser, @Param("propertyId") propertyId: string) {
    return this.favoritesService.remove(user.sub, propertyId);
  }
}
