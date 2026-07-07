import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findMine(userId: string) {
    const data = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            images: { orderBy: { displayOrder: "asc" }, take: 1 }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return { data, meta: {}, error: null };
  }

  async add(userId: string, propertyId: string) {
    const property = await this.prisma.property.findFirst({
      where: {
        id: propertyId,
        status: "AVAILABLE",
        verificationStatus: "VERIFIED"
      },
      select: { id: true }
    });

    if (!property) {
      throw new NotFoundException("Property is not available to favorite");
    }

    const data = await this.prisma.favorite.upsert({
      where: { userId_propertyId: { userId, propertyId } },
      create: { userId, propertyId },
      update: {}
    });

    return { data, meta: {}, error: null };
  }

  async remove(userId: string, propertyId: string) {
    await this.prisma.favorite.deleteMany({
      where: { userId, propertyId }
    });

    return { data: { propertyId }, meta: {}, error: null };
  }
}
