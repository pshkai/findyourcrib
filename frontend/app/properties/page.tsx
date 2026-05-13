import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import PropertyCard from "@/components/PropertyCard";

import { getProperties } from "@/lib/api";

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <Container>

        <SectionHeader
          eyebrow="Browse Properties"
          title="Explore Available Properties"
          description="Discover apartments, villas, studios, and rental homes across Nepal."
        />

        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">

          {/* Sidebar */}
          <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm">

            <h3 className="text-lg font-semibold text-gray-900">
              Filters
            </h3>

            <div className="mt-6 space-y-5">

              <input
                type="text"
                placeholder="Search location..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
              />

              <select className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none">
                <option>All Types</option>
              </select>

              <button className="w-full rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Content */}
          <div>

            <div className="mb-8 flex items-center justify-between">

              <p className="text-sm text-gray-600">
                Showing {properties.length} properties
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

              {properties.map((property: any) => (
                <PropertyCard
                  key={property.id}
                  image={property.images?.[0] || "/placeholder.jpg"}
                  title={property.title}
                  price={`$${property.price}`}
                  township={property.township}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  propertyType={property.propertyType}
                  availability={
                    property.available
                      ? "Available"
                      : "Rented"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}