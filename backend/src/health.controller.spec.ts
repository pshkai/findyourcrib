import { ServiceUnavailableException } from "@nestjs/common";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  function createController() {
    const prisma = {
      $queryRaw: jest.fn()
    };

    return {
      controller: new HealthController(prisma as never),
      prisma
    };
  }

  it("reports process health", () => {
    const { controller } = createController();

    expect(controller.check()).toMatchObject({
      data: {
        status: "ok"
      },
      meta: {},
      error: null
    });
  });

  it("reports readiness when the database responds", async () => {
    const { controller, prisma } = createController();
    prisma.$queryRaw.mockResolvedValue([{ "?column?": 1 }]);

    await expect(controller.ready()).resolves.toMatchObject({
      data: {
        checks: {
          database: "ok"
        },
        status: "ready"
      },
      meta: {},
      error: null
    });
  });

  it("fails readiness when the database is unavailable", async () => {
    const { controller, prisma } = createController();
    prisma.$queryRaw.mockRejectedValue(new Error("connection refused"));

    await expect(controller.ready()).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
