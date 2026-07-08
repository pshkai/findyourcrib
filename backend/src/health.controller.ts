import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  check() {
    return {
      data: {
        status: "ok",
        timestamp: new Date().toISOString()
      },
      meta: {},
      error: null
    };
  }

  @Get("ready")
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        data: {
          checks: {
            database: "ok"
          },
          status: "ready",
          timestamp: new Date().toISOString()
        },
        meta: {},
        error: null
      };
    } catch {
      throw new ServiceUnavailableException("Database is not reachable");
    }
  }
}
