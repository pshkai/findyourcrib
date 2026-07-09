import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { CreateUploadUrlDto } from "./dto";

@Injectable()
export class MediaService {
  private readonly bucket: string | undefined;
  private readonly publicUrlBase: string | undefined;
  private readonly supabase: SupabaseClient | null;

  constructor(configService: ConfigService) {
    const supabaseUrl = configService.get<string>("SUPABASE_URL");
    const serviceRoleKey = configService.get<string>("SUPABASE_SERVICE_ROLE_KEY");
    this.bucket = configService.get<string>("SUPABASE_STORAGE_BUCKET");
    this.publicUrlBase = supabaseUrl && this.bucket ? `${supabaseUrl}/storage/v1/object/public/${this.bucket}` : undefined;
    this.supabase = supabaseUrl && serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } }) : null;
  }

  async createSignedUploadUrl(agentId: string, dto: CreateUploadUrlDto) {
    if (!this.supabase || !this.bucket || !this.publicUrlBase) {
      throw new ServiceUnavailableException("Media storage is not configured");
    }

    const path = `properties/${agentId}/${randomUUID()}-${this.safeFileName(dto.fileName)}`;
    const { data, error } = await this.supabase.storage.from(this.bucket).createSignedUploadUrl(path);

    if (error || !data?.signedUrl) {
      throw new ServiceUnavailableException("Unable to create media upload URL");
    }

    return {
      data: {
        contentType: dto.contentType,
        path,
        publicUrl: `${this.publicUrlBase}/${path}`,
        signedUrl: data.signedUrl
      },
      meta: {},
      error: null
    };
  }

  private safeFileName(fileName: string) {
    return fileName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 96);
  }
}
