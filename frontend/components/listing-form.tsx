"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Building2, CheckCircle2, Circle, ImagePlus, Save, Star, Trash2, UploadCloud } from "lucide-react";
import { createListing, updateListing, uploadPropertyImage } from "../lib/dashboard-client";
import type { PropertySummary, PropertyType } from "@findyourcrib/shared";

type ListingFormMode = "create" | "edit";

type EditableListing = PropertySummary & {
  description?: string;
  address?: string;
};

interface ListingFormProps {
  mode?: ListingFormMode;
  listing?: EditableListing;
}

export function ListingForm({ mode = "create", listing }: ListingFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(listing?.title ?? "");
  const [description, setDescription] = useState(listing?.description ?? "");
  const [price, setPrice] = useState(listing?.price ? String(listing.price) : "");
  const [bedrooms, setBedrooms] = useState(listing?.bedrooms ? String(listing.bedrooms) : "");
  const [bathrooms, setBathrooms] = useState(listing?.bathrooms ? String(listing.bathrooms) : "");
  const [sizeSqm, setSizeSqm] = useState(listing?.sizeSqm ? String(listing.sizeSqm) : "");
  const [imageUrls, setImageUrls] = useState(() =>
    listing?.imageUrls?.length ? listing.imageUrls : listing?.coverImageUrl ? [listing.coverImageUrl] : [""]
  );
  const coverIndex = firstFilledImageIndex(imageUrls);
  const filledImageCount = imageUrls.filter((url) => url.trim()).length;
  const checks = listingReadinessChecks({ title, description, price, bedrooms, bathrooms, sizeSqm, imageCount: filledImageCount });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);

    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: Number(formData.get("price") ?? 0),
      propertyType: String(formData.get("propertyType") ?? "CONDO") as PropertyType,
      bedrooms: Number(formData.get("bedrooms") || 0),
      bathrooms: Number(formData.get("bathrooms") || 0),
      sizeSqm: Number(formData.get("sizeSqm") || 0),
      address: String(formData.get("address") ?? ""),
      township: String(formData.get("township") ?? ""),
      province: String(formData.get("province") ?? ""),
      coverImageUrl: String(formData.get("coverImageUrl") ?? "") || undefined,
      images: parseImageUrls(imageUrls.join("\n"))
    };
    const blockingErrors = listingReadinessChecks({
      title: payload.title,
      description: payload.description,
      price: String(payload.price),
      bedrooms: String(payload.bedrooms),
      bathrooms: String(payload.bathrooms),
      sizeSqm: String(payload.sizeSqm),
      imageCount: payload.images.length
    }).filter((check) => check.required && !check.done);

    if (blockingErrors.length) {
      setError(blockingErrors[0].error);
      setSubmitting(false);
      return;
    }

    try {
      if (mode === "edit" && listing?.id) {
        await updateListing(listing.id, payload);
      } else {
        await createListing(payload);
      }

      router.push("/dashboard/listings");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : mode === "edit" ? "Unable to update listing" : "Unable to create listing");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="listing-form" action={onSubmit}>
      <label className="wide">
        Title
        <input name="title" required minLength={8} placeholder="Sathorn skyline condo near BTS" value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label className="wide">
        Description
        <textarea
          name="description"
          required
          minLength={80}
          placeholder="Describe the property, building, commute, and contract basics."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>
      <label>
        Price
        <input name="price" required inputMode="numeric" placeholder="42000" value={price} onChange={(event) => setPrice(event.target.value)} />
      </label>
      <label>
        Type
        <select name="propertyType" defaultValue={listing?.propertyType ?? "CONDO"}>
          <option value="CONDO">Condo</option>
          <option value="APARTMENT">Apartment</option>
          <option value="HOUSE">House</option>
          <option value="VILLA">Villa</option>
          <option value="SERVICED_APARTMENT">Serviced apartment</option>
        </select>
      </label>
      <label>
        Bedrooms
        <input name="bedrooms" inputMode="numeric" placeholder="2" value={bedrooms} onChange={(event) => setBedrooms(event.target.value)} />
      </label>
      <label>
        Bathrooms
        <input name="bathrooms" inputMode="numeric" placeholder="2" value={bathrooms} onChange={(event) => setBathrooms(event.target.value)} />
      </label>
      <label>
        Size sqm
        <input name="sizeSqm" inputMode="numeric" placeholder="72" value={sizeSqm} onChange={(event) => setSizeSqm(event.target.value)} />
      </label>
      <label>
        Township
        <input name="township" required placeholder="Sathorn" defaultValue={listing?.township ?? ""} />
      </label>
      <label>
        Province
        <input name="province" required placeholder="Bangkok" defaultValue={listing?.province ?? ""} />
      </label>
      <label className="wide">
        Address
        <input name="address" required placeholder="Building, street, area" defaultValue={listing?.address ?? ""} />
      </label>
      <input type="hidden" name="coverImageUrl" value={firstFilledImageUrl(imageUrls)} />
      <div className="wide image-url-field">
        <div className="image-field-header">
          <div>
            <span>
              <ImagePlus size={16} />
              Listing gallery
            </span>
            <p>{galleryGuidance(filledImageCount)}</p>
          </div>
          <button type="button" onClick={() => setImageUrls((urls) => [...urls, ""])} aria-label="Add image">
            <ImagePlus size={16} />
            Add image
          </button>
        </div>
        <div className="image-url-grid">
          {imageUrls.map((imageUrl, index) => (
            <div className="image-url-row" key={index}>
              <div className="image-preview" style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}>
                {!imageUrl ? <ImagePlus size={18} /> : null}
                {index === coverIndex ? <strong>Cover</strong> : null}
              </div>
              <label>
                Image URL {index + 1}
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(event) => updateImageUrl(index, event.target.value)}
                />
              </label>
              <label className="image-upload-button" aria-label={`Upload image ${index + 1}`}>
                <UploadCloud size={16} />
                {uploadingIndex === index ? "Uploading" : "Upload"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={uploadingIndex !== null || isSubmitting}
                  onChange={(event) => void uploadImage(index, event.currentTarget)}
                />
              </label>
              <div className="image-row-controls" aria-label={`Image ${index + 1} order controls`}>
                <button type="button" onClick={() => moveImage(index, -1)} aria-label={`Move image ${index + 1} up`} disabled={index === 0 || uploadingIndex !== null}>
                  <ArrowUp size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  aria-label={`Move image ${index + 1} down`}
                  disabled={index === imageUrls.length - 1 || uploadingIndex !== null}
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => makeCover(index)}
                  aria-label={`Set image ${index + 1} as cover`}
                  disabled={!imageUrl.trim() || index === coverIndex || uploadingIndex !== null}
                >
                  <Star size={15} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeImageUrl(index)}
                aria-label={`Remove image URL ${index + 1}`}
                disabled={imageUrls.length === 1 || uploadingIndex !== null}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="wide listing-readiness">
        {checks.map((check) => (
          <span key={check.label} className={check.done ? "is-done" : undefined}>
            {check.done ? <CheckCircle2 size={15} /> : <Circle size={15} />}
            {check.label}
          </span>
        ))}
      </div>

      {error ? <p className="auth-error wide">{error}</p> : null}

      <button className="wide" type="submit" disabled={isSubmitting}>
        {mode === "edit" ? <Save size={18} /> : <Building2 size={18} />}
        {isSubmitting ? (mode === "edit" ? "Saving..." : "Creating...") : mode === "edit" ? "Save changes" : "Create listing"}
      </button>
    </form>
  );

  function updateImageUrl(index: number, value: string) {
    setImageUrls((urls) => urls.map((url, urlIndex) => (urlIndex === index ? value : url)));
  }

  function removeImageUrl(index: number) {
    setImageUrls((urls) => {
      const nextUrls = urls.filter((_, urlIndex) => urlIndex !== index);
      return nextUrls.length ? nextUrls : [""];
    });
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImageUrls((urls) => {
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= urls.length) {
        return urls;
      }

      const nextUrls = [...urls];
      [nextUrls[index], nextUrls[targetIndex]] = [nextUrls[targetIndex], nextUrls[index]];
      return nextUrls;
    });
  }

  function makeCover(index: number) {
    setImageUrls((urls) => {
      const selectedUrl = urls[index];

      if (!selectedUrl?.trim()) {
        return urls;
      }

      return [selectedUrl, ...urls.filter((_, urlIndex) => urlIndex !== index)];
    });
  }

  async function uploadImage(index: number, input: HTMLInputElement) {
    const file = input.files?.[0];
    input.value = "";

    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Upload a JPG, PNG, or WebP image.");
      return;
    }

    setError(null);
    setUploadingIndex(index);

    try {
      const publicUrl = await uploadPropertyImage(file);
      updateImageUrl(index, publicUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to upload image");
    } finally {
      setUploadingIndex(null);
    }
  }
}

function galleryGuidance(imageCount: number) {
  if (imageCount >= 5) {
    return "Strong gallery. Put the best room first as the cover.";
  }

  if (imageCount >= 1) {
    return "Add at least five photos for stronger renter confidence.";
  }

  return "Upload or paste a cover image, then add room and building photos.";
}

function listingReadinessChecks(input: {
  title: string;
  description: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  sizeSqm: string;
  imageCount: number;
}) {
  return [
    {
      done: input.title.trim().length >= 8,
      error: "Add a clear title with at least 8 characters.",
      label: "Clear title",
      required: true
    },
    {
      done: input.description.trim().length >= 80,
      error: "Add a fuller description with at least 80 characters.",
      label: "Useful description",
      required: true
    },
    {
      done: Number(input.price) > 0,
      error: "Add a monthly price greater than 0.",
      label: "Valid price",
      required: true
    },
    {
      done: Number(input.bedrooms) > 0 && Number(input.bathrooms) > 0 && Number(input.sizeSqm) > 0,
      error: "Add bedrooms, bathrooms, and size before saving.",
      label: "Rooms and size",
      required: true
    },
    {
      done: input.imageCount > 0,
      error: "Add at least one listing image before saving.",
      label: "Cover image",
      required: true
    },
    {
      done: input.imageCount >= 5,
      error: "",
      label: "Five-photo gallery",
      required: false
    }
  ];
}

function firstFilledImageUrl(urls: string[]) {
  return urls.find((url) => url.trim())?.trim() ?? "";
}

function firstFilledImageIndex(urls: string[]) {
  const index = urls.findIndex((url) => url.trim());
  return index >= 0 ? index : 0;
}

function parseImageUrls(value: string) {
  const urls = Array.from(
    new Set(
      value
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean)
    )
  );

  return urls.map((imageUrl) => ({ imageUrl }));
}
