import { PropertiesService } from "./properties.service";
import { PropertySortDto, PropertyTypeDto } from "./dto";

describe("PropertiesService", () => {
  function createService() {
    const prisma = {
      $transaction: jest.fn(),
      property: {
        count: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn()
      },
      propertyImage: {
        createMany: jest.fn(),
        deleteMany: jest.fn()
      }
    };

    return {
      prisma,
      service: new PropertiesService(prisma as never)
    };
  }

  it("uses price ascending sort for property search", async () => {
    const { prisma, service } = createService();
    prisma.property.findMany.mockReturnValue("findMany");
    prisma.property.count.mockReturnValue("count");
    prisma.$transaction.mockResolvedValue([[], 0]);

    await service.search({ page: 1, pageSize: 20, sort: PropertySortDto.PRICE_ASC });

    expect(prisma.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ price: "asc" }, { createdAt: "desc" }]
      })
    );
  });

  it("uses featured-first sort by default", async () => {
    const { prisma, service } = createService();
    prisma.property.findMany.mockReturnValue("findMany");
    prisma.property.count.mockReturnValue("count");
    prisma.$transaction.mockResolvedValue([[], 0]);

    await service.search({ page: 1, pageSize: 20, sort: PropertySortDto.FEATURED });

    expect(prisma.property.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }]
      })
    );
  });

  it("returns fallback search metadata when the database is unavailable", async () => {
    const { prisma, service } = createService();
    prisma.property.findMany.mockReturnValue("findMany");
    prisma.property.count.mockReturnValue("count");
    prisma.$transaction.mockRejectedValue(new Error("database unavailable"));

    const result = await service.search({
      maxPrice: 100000,
      page: 1,
      pageSize: 2,
      sort: PropertySortDto.PRICE_DESC
    });

    expect(result.meta).toMatchObject({
      fallback: true,
      page: 1,
      pageSize: 2,
      total: expect.any(Number)
    });
    expect(result.data).toHaveLength(2);
    expect(Number(result.data[0].price)).toBeGreaterThanOrEqual(Number(result.data[1].price));
  });

  it("creates ordered gallery images from image URLs", async () => {
    const { prisma, service } = createService();
    prisma.property.create.mockResolvedValue({ id: "property-1", images: [] });

    await service.create("agent-1", {
      address: "123 Sathorn Road",
      description: "Bright corner unit near the station",
      images: [
        { imageUrl: "https://cdn.findyourcrib.test/living.jpg", altText: "Living room" },
        { imageUrl: "https://cdn.findyourcrib.test/bedroom.jpg" }
      ],
      price: 42000,
      propertyType: PropertyTypeDto.CONDO,
      province: "Bangkok",
      title: "Sathorn skyline condo",
      township: "Sathorn"
    });

    expect(prisma.property.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          images: {
            create: [
              {
                altText: "Living room",
                displayOrder: 0,
                imageUrl: "https://cdn.findyourcrib.test/living.jpg"
              },
              {
                altText: "Sathorn skyline condo",
                displayOrder: 1,
                imageUrl: "https://cdn.findyourcrib.test/bedroom.jpg"
              }
            ]
          }
        })
      })
    );
  });

  it("replaces owned gallery images on update", async () => {
    const { prisma, service } = createService();
    prisma.property.findUnique.mockResolvedValue({ agentId: "agent-1" });
    prisma.property.update.mockResolvedValue({ title: "Existing title" });
    prisma.propertyImage.deleteMany.mockResolvedValue({ count: 2 });
    prisma.propertyImage.createMany.mockResolvedValue({ count: 1 });
    prisma.$transaction.mockImplementation((callback) =>
      callback({
        property: {
          findUniqueOrThrow: jest.fn().mockResolvedValue({ id: "property-1", images: [] }),
          update: prisma.property.update
        },
        propertyImage: prisma.propertyImage
      })
    );

    await service.updateOwned("property-1", "agent-1", {
      images: [{ imageUrl: "https://cdn.findyourcrib.test/new.jpg", altText: "New balcony view" }]
    });

    expect(prisma.propertyImage.deleteMany).toHaveBeenCalledWith({ where: { propertyId: "property-1" } });
    expect(prisma.propertyImage.createMany).toHaveBeenCalledWith({
      data: [
        {
          altText: "New balcony view",
          displayOrder: 0,
          imageUrl: "https://cdn.findyourcrib.test/new.jpg",
          propertyId: "property-1"
        }
      ]
    });
  });
});
