import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { InquiriesModule } from './inquiries/inquiries.module';

@Module({
  imports: [AuthModule, UsersModule, PropertiesModule, InquiriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
