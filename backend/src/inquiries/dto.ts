import { InquiryStatus } from "@prisma/client";
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateInquiryDto {
  @IsUUID()
  propertyId!: string;

  @IsString()
  @MinLength(10)
  message!: string;

  @IsString()
  contactName!: string;

  @IsEmail()
  contactEmail!: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}

export class UpdateInquiryStatusDto {
  @IsEnum(InquiryStatus)
  status!: InquiryStatus;
}
