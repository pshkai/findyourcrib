"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";

import { uploadPropertyImage } from "@/lib/api";

interface UploadPropertyImageProps {
  propertyId: number;
  onUploadSuccess?: () => void;
}

export default function UploadPropertyImage({
  propertyId,
  onUploadSuccess,
}: UploadPropertyImageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleUpload() {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      setIsUploading(true);

      await uploadPropertyImage(token, propertyId, selectedFile);

      alert("Image uploaded successfully.");

      setSelectedFile(null);
      setPreviewUrl("");

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-gray-100 p-3">
          <ImagePlus size={22} />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Upload Property Image
          </h3>

          <p className="text-sm text-gray-500">
            JPG, PNG, and WEBP images are supported.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full rounded-2xl border border-gray-200 p-3 text-sm"
        />

        {previewUrl && (
          <div className="relative h-72 overflow-hidden rounded-3xl border border-gray-200">
            <Image
              src={previewUrl}
              alt="Selected property preview"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-4 font-medium text-white transition hover:bg-gray-800 disabled:opacity-60"
        >
          {isUploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ImagePlus size={18} />
              Upload Image
            </>
          )}
        </button>
      </div>
    </div>
  );
}