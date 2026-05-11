import {
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  message: string;

  @IsString()
  contactName: string;

  @IsString()
  contactEmail: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}
