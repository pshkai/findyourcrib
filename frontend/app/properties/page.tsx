import Image from "next/image";

import Container from "@/components/ui/Container";
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
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Property Type
                  </label>

                  <select className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none">
                    <option>All Types</option>
                    <option>Condo</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>House</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price Range
                  </label>

                  <select className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none">
                    <option>Any Price</option>
                    <option>฿10,000 - ฿20,000</option>
                    <option>฿20,000 - ฿50,000</option>
                    <option>฿50,000+</option>
                  </select>
                </div>

                <button className="w-full rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800">
                  Apply Filters
                </button>
              </div>
            </aside>

            <div>
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Available Listings</p>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {properties.length} Properties Found
                  </h2>
                </div>

                <select className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none">
                  <option>Sort By</option>
                  <option>Newest</option>
                  <option>Lowest Price</option>
                  <option>Highest Price</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {properties.map((property: any) => (
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
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}