import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import cloudinary from '../common/cloudinary';

import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertiesService } from './properties.service';

import { Query } from '@nestjs/common';

import { SearchPropertyDto } from './dto/search-property.dto';

import {
  Delete,
  Patch,
} from '@nestjs/common';

import { UpdatePropertyDto } from './dto/update-property.dto';

import { AdminGuard } from '../auth/admin.guard';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: any,
    @Body() dto: CreatePropertyDto,
  ) {
    return this.propertiesService.create(
      req.user.userId,
      dto,
    );
  }

  @Get()
  findAll() {
    return this.propertiesService.findAll();
  }

  @Get('search')
  search(
    @Query() query: SearchPropertyDto,
  ) {
    return this.propertiesService.search(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/listings')
  getMyProperties(
    @Req() req: any,
  ) {
    return this.propertiesService.getMyProperties(
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/dashboard')
  getDashboardStats(
    @Req() req: any,
  ) {
    return this.propertiesService.getDashboardStats(
      req.user.userId,
    );
  }

  @Get('featured')
  getFeaturedProperties() {
    return this.propertiesService.getFeaturedProperties();
  }

  @Get('nearby')
  nearbySearch(
    @Query('lat') lat: string,

    @Query('lng') lng: string,

    @Query('radius') radius: string,
  ) {
    return this.propertiesService.nearbySearch(
      Number(lat),
      Number(lng),
      Number(radius || 5),
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.propertiesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads',
    }),
  )
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: any,
  ) {
    const uploaded = await cloudinary.uploader.upload(
      file.path,
    );

    return this.propertiesService.addImage(
      id,
      uploaded.secure_url,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Body() dto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(
      id,
      req.user.userId,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.propertiesService.delete(
      id,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/verify')
  verify(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.propertiesService.verifyProperty(
      id,
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/hide')
  hide(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.propertiesService.hideProperty(
      id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/confirm')
  confirmAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.propertiesService.confirmAvailability(
      id,
      req.user.userId,
    );
  }
}
