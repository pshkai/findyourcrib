import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength
} from "class-validator";

export enum PropertyTypeDto {
  CONDO = "CONDO",
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
  VILLA = "VILLA",
  SERVICED_APARTMENT = "SERVICED_APARTMENT"
}

export enum PropertySortDto {
  NEWEST = "newest",
  PRICE_ASC = "price_asc",
  PRICE_DESC = "price_desc",
  FEATURED = "featured"
}

export class PropertySearchDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  township?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsEnum(PropertyTypeDto)
  propertyType?: PropertyTypeDto;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  bedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  bathrooms?: number;

  @IsOptional()
  @IsEnum(PropertySortDto)
  sort: PropertySortDto = PropertySortDto.FEATURED;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize = 20;
}

export class CreatePropertyDto {
  @IsString()
  @MinLength(8)
  title!: string;

  @IsString()
  @MinLength(20)
  description!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsEnum(PropertyTypeDto)
  propertyType!: PropertyTypeDto;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bathrooms?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sizeSqm?: number;

  @IsString()
  address!: string;

  @IsString()
  township!: string;

  @IsString()
  province!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  nearestStation?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  distanceToStation?: number;

  @IsOptional()
  @IsUrl({ require_tld: false })
  coverImageUrl?: string;
}

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}
