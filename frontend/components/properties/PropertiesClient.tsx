"use client";

import { useMemo, useState } from "react";

import PropertyCard from "@/components/PropertyCard";

interface PropertiesClientProps {
  properties: any[];
}

export default function PropertiesClient({ properties }: PropertiesClientProps) {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("ALL");
  const [priceRange, setPriceRange] = useState("ALL");

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesLocation =
        property.township.toLowerCase().includes(location.toLowerCase()) ||
        property.address.toLowerCase().includes(location.toLowerCase());

      const matchesType =
        propertyType === "ALL" || property.propertyType === propertyType;

      const matchesPrice =
        priceRange === "ALL" ||
        (priceRange === "LOW" && property.price < 20000) ||
        (priceRange === "MID" &&
          property.price >= 20000 &&
          property.price <= 50000) ||
        (priceRange === "HIGH" && property.price > 50000);

      return matchesLocation && matchesType && matchesPrice;
    });
  }, [properties, location, propertyType, priceRange]);

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>

        <div className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Location
            </label>

            <input
              type="text"
              placeholder="Bangkok, Phuket..."
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Property Type
            </label>

            <select
              value={propertyType}
              onChange={(event) => setPropertyType(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="CONDO">Condo</option>
              <option value="APARTMENT">Apartment</option>
              <option value="VILLA">Villa</option>
              <option value="HOUSE">House</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Price Range
            </label>

            <select
              value={priceRange}
              onChange={(event) => setPriceRange(event.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
            >
              <option value="ALL">Any Price</option>
              <option value="LOW">Below ฿20,000</option>
              <option value="MID">฿20,000 - ฿50,000</option>
              <option value="HIGH">Above ฿50,000</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setLocation("");
              setPropertyType("ALL");
              setPriceRange("ALL");
            }}
            className="w-full rounded-2xl border border-gray-200 px-5 py-3 text-sm font-medium transition hover:bg-gray-100"
          >
            Reset Filters
          </button>
        </div>
      </aside>

      <div>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">Available Listings</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredProperties.length} Properties Found
            </h2>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-gray-600 shadow-sm">
            No properties match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProperties.map((property: any) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                image={
                  property.images?.[0]?.imageUrl ||
                  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
                }
                title={property.title}
                price={`฿${property.price.toLocaleString()}/month`}
                township={property.township}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                propertyType={property.propertyType}
                availability={
                  property.status === "AVAILABLE" ? "Available" : "Rented"
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}