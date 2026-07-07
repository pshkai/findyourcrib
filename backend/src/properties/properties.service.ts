import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { PropertySearchDto } from "./dto";

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

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
}
