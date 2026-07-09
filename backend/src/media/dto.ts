import { IsIn, IsString, MaxLength } from "class-validator";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;

export class CreateUploadUrlDto {
  @IsString()
  @MaxLength(120)
  fileName!: string;

  @IsIn(allowedImageTypes)
  contentType!: (typeof allowedImageTypes)[number];
}
