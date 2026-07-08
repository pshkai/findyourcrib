"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Save } from "lucide-react";
import { createListing, updateListing } from "../lib/dashboard-client";
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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

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
      coverImageUrl: String(formData.get("coverImageUrl") ?? "") || undefined
    };

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
        <input name="title" required minLength={8} placeholder="Sathorn skyline condo near BTS" defaultValue={listing?.title ?? ""} />
      </label>
      <label className="wide">
        Description
        <textarea
          name="description"
          required
          minLength={20}
          placeholder="Describe the property, building, commute, and contract basics."
          defaultValue={listing?.description ?? ""}
        />
      </label>
      <label>
        Price
        <input name="price" required inputMode="numeric" placeholder="42000" defaultValue={listing?.price ?? ""} />
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
        <input name="bedrooms" inputMode="numeric" placeholder="2" defaultValue={listing?.bedrooms ?? ""} />
      </label>
      <label>
        Bathrooms
        <input name="bathrooms" inputMode="numeric" placeholder="2" defaultValue={listing?.bathrooms ?? ""} />
      </label>
      <label>
        Size sqm
        <input name="sizeSqm" inputMode="numeric" placeholder="72" defaultValue={listing?.sizeSqm ?? ""} />
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
      <label className="wide">
        Cover image URL
        <input name="coverImageUrl" type="url" placeholder="https://..." defaultValue={listing?.coverImageUrl ?? ""} />
      </label>

      {error ? <p className="auth-error wide">{error}</p> : null}

      <button className="wide" type="submit" disabled={isSubmitting}>
        {mode === "edit" ? <Save size={18} /> : <Building2 size={18} />}
        {isSubmitting ? (mode === "edit" ? "Saving..." : "Creating...") : mode === "edit" ? "Save changes" : "Create listing"}
      </button>
    </form>
  );
}
