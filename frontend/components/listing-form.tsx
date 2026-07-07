"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { createListing } from "../lib/dashboard-client";

export function ListingForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);

    try {
      await createListing({
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        price: Number(formData.get("price") ?? 0),
        propertyType: String(formData.get("propertyType") ?? "CONDO") as "CONDO" | "APARTMENT" | "HOUSE" | "VILLA" | "SERVICED_APARTMENT",
        bedrooms: Number(formData.get("bedrooms") || 0),
        bathrooms: Number(formData.get("bathrooms") || 0),
        sizeSqm: Number(formData.get("sizeSqm") || 0),
        address: String(formData.get("address") ?? ""),
        township: String(formData.get("township") ?? ""),
        province: String(formData.get("province") ?? ""),
        coverImageUrl: String(formData.get("coverImageUrl") ?? "") || undefined
      });

      router.push("/dashboard/listings");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create listing");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="listing-form" action={onSubmit}>
      <label className="wide">
        Title
        <input name="title" required minLength={8} placeholder="Sathorn skyline condo near BTS" />
      </label>
      <label className="wide">
        Description
        <textarea name="description" required minLength={20} placeholder="Describe the property, building, commute, and contract basics." />
      </label>
      <label>
        Price
        <input name="price" required inputMode="numeric" placeholder="42000" />
      </label>
      <label>
        Type
        <select name="propertyType" defaultValue="CONDO">
          <option value="CONDO">Condo</option>
          <option value="APARTMENT">Apartment</option>
          <option value="HOUSE">House</option>
          <option value="VILLA">Villa</option>
          <option value="SERVICED_APARTMENT">Serviced apartment</option>
        </select>
      </label>
      <label>
        Bedrooms
        <input name="bedrooms" inputMode="numeric" placeholder="2" />
      </label>
      <label>
        Bathrooms
        <input name="bathrooms" inputMode="numeric" placeholder="2" />
      </label>
      <label>
        Size sqm
        <input name="sizeSqm" inputMode="numeric" placeholder="72" />
      </label>
      <label>
        Township
        <input name="township" required placeholder="Sathorn" />
      </label>
      <label>
        Province
        <input name="province" required placeholder="Bangkok" />
      </label>
      <label className="wide">
        Address
        <input name="address" required placeholder="Building, street, area" />
      </label>
      <label className="wide">
        Cover image URL
        <input name="coverImageUrl" type="url" placeholder="https://..." />
      </label>

      {error ? <p className="auth-error wide">{error}</p> : null}

      <button className="wide" type="submit" disabled={isSubmitting}>
        <Building2 size={18} />
        {isSubmitting ? "Creating..." : "Create listing"}
      </button>
    </form>
  );
}
