import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async addFavorite(
    userId: number,
    propertyId: number,
  ) {
    return this.prisma.favorite.create({
      data: {
        userId,
        propertyId,
      },
    });
  }

  async removeFavorite(
    userId: number,
    propertyId: number,
  ) {
    return this.prisma.favorite.deleteMany({
      where: {
        userId,
        propertyId,
      },
    });
  }

  async getFavorites(userId: number) {
    return this.prisma.favorite.findMany({
      where: {
        userId,
      },

      include: {
        property: {
          include: {
            images: true,
          },
        },
      },
    });
  }
}
