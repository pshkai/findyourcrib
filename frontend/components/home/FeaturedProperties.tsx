import PropertyCard from "@/components/PropertyCard";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { properties } from "@/data/properties";

export default function FeaturedProperties() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <Container>
        <FadeIn>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Featured Listings"
              title="Discover Featured Properties"
              description="Browse hand-picked premium properties across Nepal with verified listings and modern amenities."
            />

            <Button variant="outline" size="lg" className="mb-12 rounded-xl">
              View All
            </Button>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property, index) => (
            <FadeIn key={property.id} delay={index * 0.08}>
              <PropertyCard
                image={property.image}
                title={property.title}
                price={property.price}
                township={property.township}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                propertyType={property.propertyType}
                availability={property.availability}
              />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}