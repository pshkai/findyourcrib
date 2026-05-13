import Link from "next/link";

import PropertyCard from "@/components/PropertyCard";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { getProperties } from "@/lib/api";

export default async function FeaturedProperties() {
  const properties = await getProperties();
  const featuredProperties = properties.slice(0, 3);
import { properties } from "@/data/properties";

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <Container>
        <FadeIn>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Featured Listings"
              title="Featured Properties in Thailand"
              description="Browse verified condos, apartments, and villas across Bangkok, Chiang Mai, Phuket, and more."
            />

            <Button
              asChild
              variant="outline"
              size="lg"
              className="mb-12 rounded-xl"
            >
              <Link href="/properties">View All</Link>
              title="Discover Featured Properties"
              description="Browse hand-picked premium properties across Nepal with verified listings and modern amenities."
            />

            <Button variant="outline" size="lg" className="mb-12 rounded-xl">
              View All
            </Button>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {featuredProperties.map((property: any, index: number) => (
            <FadeIn key={property.id} delay={index * 0.08}>
              <PropertyCard
                id={property.id}
                image={
                  property.images?.[0]?.imageUrl ||
                  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
                }
                title={property.title}
                price={`฿${property.price.toLocaleString()}/month`}
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
                availability={
                  property.status === "AVAILABLE" ? "Available" : "Rented"
                }
                availability={property.availability}
              />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}