import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { FavoritesModule } from "./favorites/favorites.module";
import { HealthController } from "./health.controller";
import { InquiriesModule } from "./inquiries/inquiries.module";
import { PrismaModule } from "./prisma.module";
import { PropertiesModule } from "./properties/properties.module";
import { RateLimitGuard } from "./rate-limit.guard";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    FavoritesModule,
    InquiriesModule
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: RateLimitGuard }]
})
export class AppModule {}
