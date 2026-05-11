import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  HIDDEN = 'HIDDEN',
}

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  propertyType?: string;

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @IsString()
  township?: string;

  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;
}
