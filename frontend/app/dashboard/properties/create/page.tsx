"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { createProperty } from "@/lib/api";

export default function CreatePropertyPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    propertyType: "CONDO",
    bedrooms: "",
    bathrooms: "",
    sizeSqm: "",
    address: "",
    township: "",
    nearestStation: "",
    distanceToStation: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("Please login before creating a property.");
        return;
      }

      await createProperty(token, {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        propertyType: formData.propertyType,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        sizeSqm: Number(formData.sizeSqm),
        address: formData.address,
        township: formData.township,
        nearestStation: formData.nearestStation,
        distanceToStation: Number(formData.distanceToStation),
      });

      router.push("/dashboard/listings");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to create property.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="bg-gray-50 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Agent Dashboard
          </p>

          <h1 className="mt-3 text-4xl font-bold text-gray-900">
            Add New Property
          </h1>

          <p className="mt-3 text-gray-600">
            Create a new Thailand property listing for renters to discover.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <input
              name="title"
              type="text"
              placeholder="Property title"
              value={formData.title}
              onChange={handleChange}
              required
              className="rounded-xl border border-gray-200 px-4 py-3 outline-none"
            />

            <textarea
              name="description"
              placeholder="Property description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <input
                name="price"
                type="number"
                placeholder="Monthly price in THB"
                value={formData.price}
                onChange={handleChange}
                required
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none"
              />

              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none"
              >
                <option value="CONDO">Condo</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="HOUSE">House</option>
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <input
                name="bedrooms"
                type="number"
                placeholder="Bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                required
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none"
              />

              <input
                name="bathrooms"
                type="number"
                placeholder="Bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                required
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none"
              />

              <input
                name="sizeSqm"
                type="number"
                placeholder="Size sqm"
                value={formData.sizeSqm}
                onChange={handleChange}
                required
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <input
                name="township"
                type="text"
                placeholder="City / township e.g. Bangkok"
                value={formData.township}
                onChange={handleChange}
                required
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none"
              />

              <input
                name="address"
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <input
                name="nearestStation"
                type="text"
                placeholder="Nearest station e.g. BTS Asok"
                value={formData.nearestStation}
                onChange={handleChange}
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none"
              />

              <input
                name="distanceToStation"
                type="number"
                step="0.1"
                placeholder="Distance to station km"
                value={formData.distanceToStation}
                onChange={handleChange}
                className="rounded-xl border border-gray-200 px-4 py-3 outline-none"
              />
            </div>

            {errorMessage && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="rounded-2xl bg-black text-white hover:bg-gray-800"
            >
              {isLoading ? "Creating..." : "Create Property"}
            </Button>
          </form>
        </div>
      </Container>
    </main>
  );
}