import Image from "next/image";

import Container from "@/components/ui/Container";
import PropertiesClient from "@/components/properties/PropertiesClient";
import Container from "@/components/ui/Container";
import SectionHeader from "@/components/ui/SectionHeader";
import PropertyCard from "@/components/PropertyCard";

import { getProperties } from "@/lib/api";

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <main className="bg-gray-50">
      <section className="py-10 sm:py-14">
        <Container>
          <div className="relative mb-14 overflow-hidden rounded-[2rem] bg-black px-8 py-20 text-white sm:px-16">
            <Image
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
              alt="Thailand properties"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-30"
            />

            <div className="relative z-10 max-w-3xl">
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-blue-400">
                Thailand Property Marketplace
              </p>

              <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
                Explore Premium
                <span className="block text-blue-400">
                  Properties in Thailand
                </span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-200">
                Browse condos, apartments, villas, and rental homes across
                Bangkok, Chiang Mai, Phuket, Pattaya, and more.
              </p>
            </div>
          </div>

          <PropertiesClient properties={properties} />
        </Container>
      </section>
    </main>
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