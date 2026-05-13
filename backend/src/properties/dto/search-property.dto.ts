import {
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchPropertyDto {
  @IsOptional()
  @IsString()
  township?: string;

  @IsOptional()
  @IsString()
  propertyType?: string;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsNumberString()
  bedrooms?: string;
}
