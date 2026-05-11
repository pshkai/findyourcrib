import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiriesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    propertyId: number,
    customerId: number,
    dto: CreateInquiryDto,
  ) {
    return this.prisma.inquiry.create({
      data: {
        ...dto,
        propertyId,
        customerId,
      },
    });
  }

  async getPropertyInquiries(
    propertyId: number,
  ) {
    return this.prisma.inquiry.findMany({
      where: {
        propertyId,
      },

      include: {
        customer: {
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
}
