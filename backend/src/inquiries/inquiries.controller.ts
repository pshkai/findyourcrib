import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { CreateInquiryDto } from './dto/create-inquiry.dto';

import { InquiriesService } from './inquiries.service';

@Controller('inquiries')
export class InquiriesController {
  constructor(
    private readonly inquiriesService: InquiriesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':propertyId')
  create(
    @Param('propertyId', ParseIntPipe)
    propertyId: number,

    @Req() req: any,

    @Body() dto: CreateInquiryDto,
  ) {
    return this.inquiriesService.create(
      propertyId,
      req.user.userId,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('property/:propertyId')
  getPropertyInquiries(
    @Param('propertyId', ParseIntPipe)
    propertyId: number,
  ) {
    return this.inquiriesService.getPropertyInquiries(
      propertyId,
    );
  }
}
