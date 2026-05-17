import Link from "next/link";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PropertyCard from "@/components/PropertyCard";
import { getProperties } from "@/lib/api";

export default async function MyListingsPage() {
  const properties = await getProperties();

  return (
    <DashboardLayout>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Dashboard
          </p>

          <h1 className="mt-3 text-5xl font-bold text-gray-900">
            My Listings
          </h1>

          <p className="mt-4 text-gray-600">
            View and manage your property listings.
          </p>
        </div>

        <Link
          href="/dashboard/properties/create"
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Add Property
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((property: any) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title}
            price={property.price}
            township={property.township}
            propertyType={property.propertyType}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            image={property.images?.[0]?.imageUrl}
          />
        ))}
      </div>
    </DashboardLayout>
  );
}