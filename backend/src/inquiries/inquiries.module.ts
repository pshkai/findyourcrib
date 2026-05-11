import { Module } from '@nestjs/common';

import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';

import { PrismaService } from '../prisma.service';

@Module({
  controllers: [InquiriesController],
  providers: [InquiriesService, PrismaService],
})
export class InquiriesModule {}
