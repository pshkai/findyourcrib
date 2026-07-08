import { NotFoundException } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";

describe("FavoritesService", () => {
  function createService() {
    const prisma = {
      favorite: {
        deleteMany: jest.fn(),
        findMany: jest.fn(),
        upsert: jest.fn()
      },
      property: {
        findFirst: jest.fn()
      }
    };

    return {
      prisma,
      service: new FavoritesService(prisma as never)
    };
  }

  it("adds an available verified property to favorites", async () => {
    const { prisma, service } = createService();
    prisma.property.findFirst.mockResolvedValue({ id: "property-1" });
    prisma.favorite.upsert.mockResolvedValue({ userId: "user-1", propertyId: "property-1" });

    const result = await service.add("user-1", "property-1");

    expect(prisma.property.findFirst).toHaveBeenCalledWith({
      where: {
        id: "property-1",
        status: "AVAILABLE",
        verificationStatus: "VERIFIED"
      },
      select: { id: true }
    });
    expect(prisma.favorite.upsert).toHaveBeenCalledWith({
      where: { userId_propertyId: { userId: "user-1", propertyId: "property-1" } },
      create: { userId: "user-1", propertyId: "property-1" },
      update: {}
    });
    expect(result.data).toEqual({ userId: "user-1", propertyId: "property-1" });
  });

  it("rejects unavailable or unverified properties", async () => {
    const { prisma, service } = createService();
    prisma.property.findFirst.mockResolvedValue(null);

    await expect(service.add("user-1", "property-1")).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.favorite.upsert).not.toHaveBeenCalled();
  });

  it("removes a favorite idempotently", async () => {
    const { prisma, service } = createService();
    prisma.favorite.deleteMany.mockResolvedValue({ count: 1 });

    const result = await service.remove("user-1", "property-1");

    expect(prisma.favorite.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user-1", propertyId: "property-1" }
    });
    expect(result.data).toEqual({ propertyId: "property-1" });
  });
});
