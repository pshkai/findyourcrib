import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';

import { SearchPropertyDto } from './dto/search-property.dto';

import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(agentId: number, dto: CreatePropertyDto) {
    return this.prisma.property.create({
      data: {
        ...dto,
        agentId,
      },
    });
  }

  async findAll() {
    return this.prisma.property.findMany({
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.property.findUnique({
      where: { id },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: true,
      },
    });
  }
  async addImage(
    propertyId: number,
    imageUrl: string,
  ) {
    return this.prisma.propertyImage.create({
      data: {
        propertyId,
        imageUrl,
      },
    });
  }

  async search(dto: SearchPropertyDto) {
    return this.prisma.property.findMany({
      where: {
        status: 'AVAILABLE',

        township: dto.township
          ? {
              contains: dto.township,
              mode: 'insensitive',
            }
          : undefined,

        propertyType: dto.propertyType
          ? {
              equals: dto.propertyType,
              mode: 'insensitive',
            }
          : undefined,

        price: {
          gte: dto.minPrice
            ? Number(dto.minPrice)
            : undefined,

          lte: dto.maxPrice
            ? Number(dto.maxPrice)
            : undefined,
        },

        bedrooms: dto.bedrooms
          ? Number(dto.bedrooms)
          : undefined,
      },

      include: {
        images: true,

        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(
    propertyId: number,
    agentId: number,
    dto: UpdatePropertyDto,
  ) {
    const property =
      await this.prisma.property.findUnique({
        where: {
          id: propertyId,
        },
      });

    if (!property) {
      throw new NotFoundException(
        'Property not found',
      );
    }

    if (property.agentId !== agentId) {
      throw new ForbiddenException(
        'You do not own this property',
      );
    }

    return this.prisma.property.update({
      where: {
        id: propertyId,
      },
      data: dto,
    });
  }

  async delete(
    propertyId: number,
    agentId: number,
  ) {
    const property =
      await this.prisma.property.findUnique({
        where: {
          id: propertyId,
        },
      });

    if (!property) {
      throw new NotFoundException(
        'Property not found',
      );
    }

    if (property.agentId !== agentId) {
      throw new ForbiddenException(
        'You do not own this property',
      );
    }

    return this.prisma.property.delete({
      where: {
        id: propertyId,
      },
    });
  }
}
