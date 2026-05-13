import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':propertyId')
  addFavorite(
    @Req() req: any,

    @Param('propertyId', ParseIntPipe)
    propertyId: number,
  ) {
    return this.favoritesService.addFavorite(
      req.user.userId,
      propertyId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':propertyId')
  removeFavorite(
    @Req() req: any,

    @Param('propertyId', ParseIntPipe)
    propertyId: number,
  ) {
    return this.favoritesService.removeFavorite(
      req.user.userId,
      propertyId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getFavorites(@Req() req: any) {
    return this.favoritesService.getFavorites(
      req.user.userId,
    );
  }
}
