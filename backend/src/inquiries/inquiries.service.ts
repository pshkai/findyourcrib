import { Injectable, NotFoundException } from "@nestjs/common";
import { InquiryStatus } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { CreateInquiryDto } from "./dto";

@Injectable()
export class InquiriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInquiryDto, customerId?: string) {
    const property = await this.prisma.property.findFirst({
      where: {
        id: dto.propertyId,
        status: "AVAILABLE",
        verificationStatus: "VERIFIED"
      },
      select: { id: true }
    });

    if (!property) {
      throw new NotFoundException("Property is not available for inquiries");
    }

    const data = await this.prisma.inquiry.create({
      data: {
        propertyId: dto.propertyId,
        customerId,
        message: dto.message,
        contactName: dto.contactName,
        contactEmail: dto.contactEmail.toLowerCase(),
        contactPhone: dto.contactPhone
      }
    });

    return { data, meta: {}, error: null };
  }

  async findForAgent(agentId: string) {
    const data = await this.prisma.inquiry.findMany({
      where: { property: { agentId } },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            township: true,
            province: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return { data, meta: {}, error: null };
  }

  async updateStatus(id: string, agentId: string, status: InquiryStatus) {
    const inquiry = await this.prisma.inquiry.findFirst({
      where: { id, property: { agentId } },
      select: { id: true }
    });

    if (!inquiry) {
      throw new NotFoundException("Inquiry not found");
    }

    const data = await this.prisma.inquiry.update({
      where: { id },
      data: { status },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            township: true,
            province: true
          }
        }
      }
    });

    return { data, meta: {}, error: null };
  }
}
