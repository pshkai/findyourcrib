import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma, VerificationStatus } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { CreatePropertyDto, PropertySearchDto, PropertySortDto, UpdatePropertyDto } from "./dto";
import { fallbackProperties } from "./fallback-properties";

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(agentId: string, dto: CreatePropertyDto) {
    const images = this.imageCreateInput(dto);
    this.assertHasListingImage(images);
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
        images: images
          ? {
              create: images
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
    try {
      const [items, total] = await this.prisma.$transaction([
        this.prisma.property.findMany({
          where,
          include: { images: { orderBy: { displayOrder: "asc" }, take: 1 } },
          orderBy: this.searchOrderBy(query.sort),
          skip: (page - 1) * pageSize,
          take: pageSize
        }),
        this.prisma.property.count({ where })
      ]);

      return { data: items, meta: { page, pageSize, total }, error: null };
    } catch (error) {
      this.logger.warn(`Serving fallback property search because the database is unavailable: ${this.errorMessage(error)}`);
      const filtered = this.sortFallbackProperties(this.filterFallbackProperties(query), query.sort);
      const items = filtered.slice((page - 1) * pageSize, page * pageSize);
      return { data: items, meta: { page, pageSize, total: filtered.length, fallback: true }, error: null };
    }
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

  async findOwned(id: string, agentId: string) {
    await this.assertOwnership(id, agentId);

    const data = await this.prisma.property.findUnique({
      where: { id },
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        _count: { select: { inquiries: true, favorites: true } }
      }
    });

    if (!data) {
      throw new NotFoundException("Property not found");
    }

    return { data, meta: {}, error: null };
  }

  async featured() {
    try {
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
    } catch (error) {
      this.logger.warn(`Serving fallback featured properties because the database is unavailable: ${this.errorMessage(error)}`);
      return { data: fallbackProperties, meta: { fallback: true }, error: null };
    }
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
    try {
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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.warn(`Serving fallback property detail because the database is unavailable: ${this.errorMessage(error)}`);
      const property = fallbackProperties.find((item) => item.id === id);

      if (!property) {
        throw new NotFoundException("Property not found");
      }

      return { data: property, meta: { fallback: true }, error: null };
    }
  }

  async updateOwned(id: string, agentId: string, dto: UpdatePropertyDto) {
    await this.assertOwnership(id, agentId);

    const data = await this.prisma.$transaction(async (tx) => {
      const property = await tx.property.update({
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

      if (dto.coverImageUrl !== undefined || dto.images !== undefined) {
        await tx.propertyImage.deleteMany({ where: { propertyId: id } });

        const images = this.imageCreateInput(dto, property.title);
        this.assertHasListingImage(images);
        if (images?.length) {
          await tx.propertyImage.createMany({
            data: images.map((image) => ({
              ...image,
              propertyId: id
            }))
          });
        }
      }

      return tx.property.findUniqueOrThrow({
        where: { id },
        include: {
          images: { orderBy: { displayOrder: "asc" }, take: 1 },
          _count: { select: { inquiries: true, favorites: true } }
        }
      });
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

  private imageCreateInput(dto: Pick<CreatePropertyDto, "coverImageUrl" | "images"> & { title?: string }, fallbackTitle?: string) {
    const seen = new Set<string>();
    const imageUrls = [
      ...(dto.coverImageUrl ? [{ imageUrl: dto.coverImageUrl.trim(), altText: dto.title ?? fallbackTitle }] : []),
      ...(dto.images ?? []).map((image) => ({ imageUrl: image.imageUrl.trim(), altText: image.altText?.trim() || undefined }))
    ].filter((image) => {
      if (!image.imageUrl || seen.has(image.imageUrl)) {
        return false;
      }

      seen.add(image.imageUrl);
      return true;
    });

    if (!imageUrls.length) {
      return undefined;
    }

    return imageUrls.map((image, index) => ({
      imageUrl: image.imageUrl,
      altText: image.altText || dto.title || fallbackTitle,
      displayOrder: index
    }));
  }

  private assertHasListingImage(images: ReturnType<PropertiesService["imageCreateInput"]>) {
    if (!images?.length) {
      throw new BadRequestException("Add at least one listing image before saving");
    }
  }

  private filterFallbackProperties(query: PropertySearchDto) {
    const searchTerm = query.query?.toLowerCase();

    return fallbackProperties.filter((property) => {
      const matchesSearch = searchTerm
        ? [property.title, property.description, property.township, property.province].some((value) =>
            value.toLowerCase().includes(searchTerm)
          )
        : true;

      return (
        matchesSearch &&
        (!query.township || property.township.toLowerCase().includes(query.township.toLowerCase())) &&
        (!query.province || property.province.toLowerCase().includes(query.province.toLowerCase())) &&
        (!query.propertyType || property.propertyType === query.propertyType) &&
        (!query.bedrooms || property.bedrooms >= query.bedrooms) &&
        (!query.bathrooms || property.bathrooms >= query.bathrooms) &&
        (!query.minPrice || property.price >= query.minPrice) &&
        (!query.maxPrice || property.price <= query.maxPrice)
      );
    });
  }

  private searchOrderBy(sort: PropertySortDto = PropertySortDto.FEATURED): Prisma.PropertyOrderByWithRelationInput[] {
    if (sort === PropertySortDto.PRICE_ASC) {
      return [{ price: "asc" }, { createdAt: "desc" }];
    }

    if (sort === PropertySortDto.PRICE_DESC) {
      return [{ price: "desc" }, { createdAt: "desc" }];
    }

    if (sort === PropertySortDto.NEWEST) {
      return [{ createdAt: "desc" }];
    }

    return [{ isFeatured: "desc" }, { createdAt: "desc" }];
  }

  private sortFallbackProperties(properties: typeof fallbackProperties, sort: PropertySortDto = PropertySortDto.FEATURED) {
    const sorted = [...properties];

    if (sort === PropertySortDto.PRICE_ASC) {
      return sorted.sort((a, b) => a.price - b.price);
    }

    if (sort === PropertySortDto.PRICE_DESC) {
      return sorted.sort((a, b) => b.price - a.price);
    }

    return sorted;
  }

  private errorMessage(error: unknown) {
    return error instanceof Error ? error.message : "unknown error";
  }
}
