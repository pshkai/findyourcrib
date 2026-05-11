import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  propertyType: string;

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @IsNumber()
  sizeSqm?: number;

  @IsString()
  address: string;

  @IsString()
  township: string;

  @IsOptional()
  @IsString()
  nearestStation?: string;
}
