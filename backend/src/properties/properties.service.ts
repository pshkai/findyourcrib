import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, VerificationStatus } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { CreatePropertyDto, PropertySearchDto, UpdatePropertyDto } from "./dto";

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(agentId: string, dto: CreatePropertyDto) {
    const property = await this.prisma.property.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        propertyType: dto.propertyType,
        bedrooms: dto.bedrooms,
        bathrooms: dto.bathrooms,
        sizeSqm: dto.sizeSqm,
        address: dto.address,
        township: dto.township,
        province: dto.province,
        latitude: dto.latitude,
        longitude: dto.longitude,
        nearestStation: dto.nearestStation,
        distanceToStation: dto.distanceToStation,
        status: "AVAILABLE",
        expiresAt: this.nextExpiry(),
        lastConfirmedAt: new Date(),
        agent: { connect: { id: agentId } },
        images: dto.coverImageUrl
          ? {
              create: {
                imageUrl: dto.coverImageUrl,
                displayOrder: 0,
                altText: dto.title
              }
            }
          : undefined
      },
      include: { images: true }
    });

    return { data: property, meta: {}, error: null };
  }

  async search(query: PropertySearchDto) {
    const where: Prisma.PropertyWhereInput = {
      status: "AVAILABLE",
      verificationStatus: "VERIFIED",
      ...(query.query
        ? {
            OR: [
              { title: { contains: query.query, mode: "insensitive" } },
              { description: { contains: query.query, mode: "insensitive" } },
              { township: { contains: query.query, mode: "insensitive" } },
              { province: { contains: query.query, mode: "insensitive" } }
            ]
          }
        : {}),
      ...(query.township ? { township: { contains: query.township, mode: "insensitive" } } : {}),
      ...(query.province ? { province: { contains: query.province, mode: "insensitive" } } : {}),
      ...(query.propertyType ? { propertyType: query.propertyType } : {}),
      ...(query.bedrooms ? { bedrooms: { gte: query.bedrooms } } : {}),
      ...(query.bathrooms ? { bathrooms: { gte: query.bathrooms } } : {}),
      ...(query.minPrice || query.maxPrice
        ? {
            price: {
              ...(query.minPrice ? { gte: query.minPrice } : {}),
              ...(query.maxPrice ? { lte: query.maxPrice } : {})
            }
          }
        : {})
    };

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.property.findMany({
        where,
        include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.property.count({ where })
    ]);

    return { data: items, meta: { page, pageSize, total }, error: null };
  }

  async findMine(agentId: string) {
    const data = await this.prisma.property.findMany({
      where: { agentId },
      include: {
        images: { orderBy: { displayOrder: "asc" }, take: 1 },
        _count: { select: { inquiries: true, favorites: true } }
      },
      orderBy: { updatedAt: "desc" }
    });

    return { data, meta: {}, error: null };
  }

  async featured() {
    const data = await this.prisma.property.findMany({
      where: {
        status: "AVAILABLE",
        verificationStatus: "VERIFIED",
        isFeatured: true
      },
      include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 8
    });

    return { data, meta: {}, error: null };
  }

  async reviewQueue() {
    const data = await this.prisma.property.findMany({
      where: { verificationStatus: "PENDING" },
      include: {
        agent: { select: { id: true, name: true, email: true, phoneNumber: true } },
        images: { orderBy: { displayOrder: "asc" }, take: 1 }
      },
      orderBy: { updatedAt: "asc" }
    });

    return { data, meta: {}, error: null };
  }

  async setVerification(id: string, verificationStatus: VerificationStatus) {
    await this.assertExists(id);
    const data = await this.prisma.property.update({
      where: { id },
      data: { verificationStatus }
    });

    return { data, meta: {}, error: null };
  }

  async setFeatured(id: string, isFeatured: boolean) {
    await this.assertExists(id);
    const data = await this.prisma.property.update({
      where: { id },
      data: { isFeatured }
    });

    return { data, meta: {}, error: null };
  }

  async hide(id: string) {
    await this.assertExists(id);
    const data = await this.prisma.property.update({
      where: { id },
      data: { status: "HIDDEN" }
    });

    return { data, meta: {}, error: null };
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        agent: { select: { id: true, name: true, phoneNumber: true } },
        images: { orderBy: { displayOrder: "asc" } },
        amenities: { include: { amenity: true } }
      }
    });

    if (!property) {
      throw new NotFoundException("Property not found");
    }

    return { data: property, meta: {}, error: null };
  }

  async updateOwned(id: string, agentId: string, dto: UpdatePropertyDto) {
    await this.assertOwnership(id, agentId);

    const data = await this.prisma.property.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        propertyType: dto.propertyType,
        bedrooms: dto.bedrooms,
        bathrooms: dto.bathrooms,
        sizeSqm: dto.sizeSqm,
        address: dto.address,
        township: dto.township,
        province: dto.province,
        latitude: dto.latitude,
        longitude: dto.longitude,
        nearestStation: dto.nearestStation,
        distanceToStation: dto.distanceToStation,
        verificationStatus: "PENDING"
      }
    });

    return { data, meta: {}, error: null };
  }

  async deleteOwned(id: string, agentId: string) {
    await this.assertOwnership(id, agentId);
    const data = await this.prisma.property.delete({ where: { id } });

    return { data, meta: {}, error: null };
  }

  async confirmAvailability(id: string, agentId: string) {
    await this.assertOwnership(id, agentId);
    const data = await this.prisma.property.update({
      where: { id },
      data: {
        status: "AVAILABLE",
        expiresAt: this.nextExpiry(),
        lastConfirmedAt: new Date()
      }
    });

    return { data, meta: {}, error: null };
  }

  private async assertOwnership(id: string, agentId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      select: { agentId: true }
    });

    if (!property) {
      throw new NotFoundException("Property not found");
    }

    if (property.agentId !== agentId) {
      throw new ForbiddenException("You do not own this property");
    }
  }

  private async assertExists(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!property) {
      throw new NotFoundException("Property not found");
    }
  }

  private nextExpiry() {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    return expiresAt;
  }
}
