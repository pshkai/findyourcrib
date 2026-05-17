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

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Filters
            </h2>

            <div className="mt-6 grid gap-5">
              <input
                type="text"
                placeholder="Location"
                className="rounded-2xl border border-gray-200 px-4 py-4 outline-none"
              />

              <select className="rounded-2xl border border-gray-200 px-4 py-4 outline-none">
                <option>All Types</option>
                <option>Condo</option>
                <option>Apartment</option>
                <option>Villa</option>
                <option>House</option>
              </select>

              <select className="rounded-2xl border border-gray-200 px-4 py-4 outline-none">
                <option>Any Price</option>
                <option>Below ฿20,000</option>
                <option>฿20,000 - ฿50,000</option>
                <option>Above ฿50,000</option>
              </select>

              <button className="rounded-full bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800">
                Apply Filters
              </button>
            </div>
          </aside>

          <div>
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Showing {properties.length} properties
              </p>

              <select className="rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none">
                <option>Sort by</option>
                <option>Newest</option>
                <option>Lowest Price</option>
                <option>Highest Price</option>
              </select>
            </div>

            {properties.length === 0 ? (
  <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
    <h2 className="text-2xl font-bold text-gray-900">
      No properties found
    </h2>

    <p className="mt-3 text-gray-600">
      Please check back later for new property listings.
    </p>
  </div>
) : (
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
)}
          </div>
        </div>
      </div>
    </main>
  );
}