import Link from "next/link";

import PropertyCard from "@/components/PropertyCard";
import { getProperties } from "@/lib/api";

export default async function Home() {
  const properties = await getProperties();
  const featuredProperties = properties.slice(0, 3);

  return (
    <main>
      <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
              Find Your Crib
            </p>

            <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-tight text-gray-900 sm:text-7xl">
              Find verified rental homes across Thailand.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Discover condos, apartments, villas, and houses in Bangkok,
              Chiang Mai, Phuket, Pattaya, and other popular areas.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/properties"
                className="rounded-full bg-black px-7 py-4 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Browse Properties
              </Link>

              <Link
                href="/register"
                className="rounded-full border border-gray-300 bg-white px-7 py-4 text-center text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                List Your Property
              </Link>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-3 gap-4">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">500+</h3>
                <p className="mt-1 text-sm text-gray-500">Listings</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900">20+</h3>
                <p className="mt-1 text-sm text-gray-500">Thai Cities</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900">24/7</h3>
                <p className="mt-1 text-sm text-gray-500">Support</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-[2.5rem] bg-white p-4 shadow-2xl">
            <div className="h-[460px] rounded-[2rem] bg-[url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85')] bg-cover bg-center" />

          </div>
        </div>
      </section>

      <section className="-mt-8 bg-white px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-gray-200 bg-white p-6 shadow-xl">
          <div className="grid gap-4 md:grid-cols-4">
            <input
              type="text"
              placeholder="Bangkok, Phuket, Chiang Mai..."
              className="rounded-2xl border border-gray-200 px-4 py-4 outline-none"
            />

            <select className="rounded-2xl border border-gray-200 px-4 py-4 outline-none">
              <option>Property Type</option>
              <option>Condo</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>House</option>
            </select>

            <select className="rounded-2xl border border-gray-200 px-4 py-4 outline-none">
              <option>Price Range</option>
              <option>฿10,000 - ฿20,000</option>
              <option>฿20,000 - ฿50,000</option>
              <option>฿50,000+</option>
            </select>

            <Link
              href="/properties"
              className="rounded-2xl bg-black px-5 py-4 text-center font-semibold text-white transition hover:bg-gray-800"
            >
              Search
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
                Featured Listings
              </p>

              <h2 className="mt-3 text-4xl font-bold text-gray-900">
                Featured Properties in Thailand
              </h2>

              <p className="mt-3 max-w-2xl text-gray-600">
                Browse verified condos, apartments, and villas from real agents.
              </p>
            </div>

            <Link
              href="/properties"
              className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-gray-100"
            >
              View All
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProperties.map((property: any) => (
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
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-black px-8 py-16 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            For Property Owners
          </p>

          <h2 className="mt-4 text-4xl font-bold sm:text-5xl">
            List your rental property on FYC.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-gray-300">
            Reach renters looking for condos, apartments, houses, and villas
            across Thailand.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-block rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Get Started
          </Link>
        </div>
      </section>
    </main>
  );
}