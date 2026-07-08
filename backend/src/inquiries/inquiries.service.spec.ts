import { NotFoundException } from "@nestjs/common";
import { InquiryStatus } from "@prisma/client";
import { InquiriesService } from "./inquiries.service";

describe("InquiriesService", () => {
  function createService() {
    const prisma = {
      inquiry: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn()
      },
      property: {
        findFirst: jest.fn()
      }
    };

    return {
      prisma,
      service: new InquiriesService(prisma as never)
    };
  }

  it("creates an inquiry for an available verified property", async () => {
    const { prisma, service } = createService();
    prisma.property.findFirst.mockResolvedValue({ id: "property-1" });
    prisma.inquiry.create.mockResolvedValue({ id: "inquiry-1" });

    const result = await service.create(
      {
        propertyId: "property-1",
        contactName: "Renter",
        contactEmail: "RENTER@EXAMPLE.COM",
        contactPhone: "123",
        message: "I would like to visit this property."
      },
      "user-1"
    );

    expect(prisma.property.findFirst).toHaveBeenCalledWith({
      where: {
        id: "property-1",
        status: "AVAILABLE",
        verificationStatus: "VERIFIED"
      },
      select: { id: true }
    });
    expect(prisma.inquiry.create).toHaveBeenCalledWith({
      data: {
        propertyId: "property-1",
        customerId: "user-1",
        message: "I would like to visit this property.",
        contactName: "Renter",
        contactEmail: "renter@example.com",
        contactPhone: "123"
      }
    });
    expect(result.data).toEqual({ id: "inquiry-1" });
  });

  it("rejects inquiries for unavailable properties", async () => {
    const { prisma, service } = createService();
    prisma.property.findFirst.mockResolvedValue(null);

    await expect(
      service.create({
        propertyId: "property-1",
        contactName: "Renter",
        contactEmail: "renter@example.com",
        message: "I would like to visit this property."
      })
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.inquiry.create).not.toHaveBeenCalled();
  });

  it("updates inquiry status only for the owning agent", async () => {
    const { prisma, service } = createService();
    prisma.inquiry.findFirst.mockResolvedValue({ id: "inquiry-1" });
    prisma.inquiry.update.mockResolvedValue({ id: "inquiry-1", status: InquiryStatus.CONTACTED });

    const result = await service.updateStatus("inquiry-1", "agent-1", InquiryStatus.CONTACTED);

    expect(prisma.inquiry.findFirst).toHaveBeenCalledWith({
      where: { id: "inquiry-1", property: { agentId: "agent-1" } },
      select: { id: true }
    });
    expect(prisma.inquiry.update).toHaveBeenCalledWith({
      where: { id: "inquiry-1" },
      data: { status: InquiryStatus.CONTACTED },
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
    expect(result.data).toEqual({ id: "inquiry-1", status: InquiryStatus.CONTACTED });
  });

  it("rejects status updates for inquiries outside the agent scope", async () => {
    const { prisma, service } = createService();
    prisma.inquiry.findFirst.mockResolvedValue(null);

    await expect(service.updateStatus("inquiry-1", "agent-1", InquiryStatus.CLOSED)).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.inquiry.update).not.toHaveBeenCalled();
  });
});
