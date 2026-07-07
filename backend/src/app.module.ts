import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { InquiriesModule } from "./inquiries/inquiries.module";
import { PrismaService } from "./prisma.service";
import { PropertiesModule } from "./properties/properties.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    PropertiesModule,
    InquiriesModule
  ],
  providers: [PrismaService]
})
export class AppModule {}
