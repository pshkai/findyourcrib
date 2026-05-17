import PropertyCard from "@/components/PropertyCard";
import { getProperties } from "@/lib/api";

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <main className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Thailand Properties
          </p>

          <h1 className="mt-3 text-5xl font-bold text-gray-900">
            Browse Available Listings
          </h1>

          <p className="mt-4 max-w-2xl text-gray-600">
            Explore verified condos, apartments, houses, and villas across
            Thailand.
          </p>
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
      </div>
    </main>
  );
}