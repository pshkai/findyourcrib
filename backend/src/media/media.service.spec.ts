import { ConfigService } from "@nestjs/config";
import { ServiceUnavailableException } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";
import { MediaService } from "./media.service";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn()
}));

describe("MediaService", () => {
  function config(values: Record<string, string | undefined>) {
    return {
      get: jest.fn((key: string) => values[key])
    } as unknown as ConfigService;
  }

  beforeEach(() => {
    jest.mocked(createClient).mockReset();
  });

  it("creates a signed upload URL and public URL", async () => {
    const createSignedUploadUrl = jest.fn().mockResolvedValue({ data: { signedUrl: "https://signed.example/upload" } });
    jest.mocked(createClient).mockReturnValue({
      storage: {
        from: jest.fn().mockReturnValue({ createSignedUploadUrl })
      }
    } as never);
    const service = new MediaService(
      config({
        SUPABASE_SERVICE_ROLE_KEY: "service-role",
        SUPABASE_STORAGE_BUCKET: "property-media",
        SUPABASE_URL: "https://supabase.example"
      })
    );

    const result = await service.createSignedUploadUrl("agent-1", {
      contentType: "image/webp",
      fileName: "Living Room!.webp"
    });

    expect(createSignedUploadUrl).toHaveBeenCalledWith(expect.stringMatching(/^properties\/agent-1\/.+-living-room-.webp$/));
    expect(result.data).toMatchObject({
      contentType: "image/webp",
      publicUrl: expect.stringContaining("https://supabase.example/storage/v1/object/public/property-media/properties/agent-1/"),
      signedUrl: "https://signed.example/upload"
    });
  });

  it("fails when media storage is not configured", async () => {
    const service = new MediaService(config({}));

    await expect(
      service.createSignedUploadUrl("agent-1", {
        contentType: "image/jpeg",
        fileName: "living.jpg"
      })
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it("fails when Supabase cannot create a signed URL", async () => {
    jest.mocked(createClient).mockReturnValue({
      storage: {
        from: jest.fn().mockReturnValue({ createSignedUploadUrl: jest.fn().mockResolvedValue({ error: new Error("nope") }) })
      }
    } as never);
    const service = new MediaService(
      config({
        SUPABASE_SERVICE_ROLE_KEY: "service-role",
        SUPABASE_STORAGE_BUCKET: "property-media",
        SUPABASE_URL: "https://supabase.example"
      })
    );

    await expect(
      service.createSignedUploadUrl("agent-1", {
        contentType: "image/png",
        fileName: "living.png"
      })
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
