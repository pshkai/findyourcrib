import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ArrayMaxSize,
  IsArray,
  ArrayMinSize,
  Max,
  Min,
  MinLength,
  ValidateNested
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

export class PropertyImageDto {
  @IsUrl({ require_tld: false })
  imageUrl!: string;

  @IsOptional()
  @IsString()
  altText?: string;
}

export class CreatePropertyDto {
  @IsString()
  @MinLength(8)
  title!: string;

  @IsString()
  @MinLength(80)
  description!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  price!: number;

  @IsEnum(PropertyTypeDto)
  propertyType!: PropertyTypeDto;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  bedrooms!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  bathrooms!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  sizeSqm!: number;

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

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => PropertyImageDto)
  images?: PropertyImageDto[];
}

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}
