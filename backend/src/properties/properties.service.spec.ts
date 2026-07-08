import { PropertiesService } from "./properties.service";
import { PropertySortDto } from "./dto";

describe("PropertiesService", () => {
  function createService() {
    const prisma = {
      $transaction: jest.fn(),
      property: {
        count: jest.fn(),
        findMany: jest.fn()
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
});
