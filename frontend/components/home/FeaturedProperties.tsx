import PropertyCard from "@/components/PropertyCard";
import Container from "@/components/ui/Container";
import { properties } from "@/data/properties";
import SectionHeader from "@/components/ui/SectionHeader";

export default function FeaturedProperties() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <Container>

        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-blue-600">
              Featured Listings
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Discover Featured Properties
            </h2>
          </div>

          <button className="rounded-xl border border-gray-300 px-5 py-2 text-sm font-medium transition hover:bg-gray-100">
            View All
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              image={property.image}
              title={property.title}
              price={property.price}
              township={property.township}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              propertyType={property.propertyType}
              availability={property.availability}
            />
          ))}
        </div>

      </Container>
    </section>
  );
}