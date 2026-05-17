import Image from "next/image";
import { notFound } from "next/navigation";

import { getPropertyById } from "@/lib/api";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { id } = await params;

  let property;

  try {
    property = await getPropertyById(id);
  } catch {
    notFound();
  }

  const image =
    property.images?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85";

  return (
    <main className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="relative h-[500px] overflow-hidden rounded-[2rem]">
            <Image
              src={image}
              alt={property.title}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
              {property.propertyType}
            </p>

            <h1 className="mt-3 text-5xl font-bold text-gray-900">
              {property.title}
            </h1>

            <p className="mt-4 text-gray-600">
              {property.address}, {property.township}
            </p>

            <p className="mt-8 leading-8 text-gray-700">
              {property.description}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Bedrooms</p>
                <p className="mt-1 text-xl font-bold">{property.bedrooms}</p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Bathrooms</p>
                <p className="mt-1 text-xl font-bold">{property.bathrooms}</p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Size</p>
                <p className="mt-1 text-xl font-bold">
                  {property.sizeSqm} sqm
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-[2rem] bg-white p-8 shadow-sm lg:sticky lg:top-28">
          <p className="text-sm text-gray-500">Monthly Rent</p>

          <h2 className="mt-2 text-4xl font-bold text-gray-900">
            ฿{property.price.toLocaleString()}/m
          </h2>

          {property.nearestStation && (
            <div className="mt-6 rounded-2xl bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Nearest Station</p>
              <p className="mt-1 font-semibold text-gray-900">
                {property.nearestStation}
              </p>
            </div>
          )}

          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="font-semibold text-gray-900">Agent</p>

            <p className="mt-2 text-gray-700">{property.agent?.name}</p>

            <p className="text-sm text-gray-500">{property.agent?.email}</p>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900">
              Send Inquiry
            </h3>

            <form className="mt-5 grid gap-4">
              <input
                type="text"
                placeholder="Your name"
                className="rounded-2xl border border-gray-200 px-4 py-3 outline-none"
              />

              <input
                type="email"
                placeholder="Email address"
                className="rounded-2xl border border-gray-200 px-4 py-3 outline-none"
              />

              <input
                type="text"
                placeholder="Phone number"
                className="rounded-2xl border border-gray-200 px-4 py-3 outline-none"
              />

              <textarea
                placeholder="Message"
                rows={4}
                className="resize-none rounded-2xl border border-gray-200 px-4 py-3 outline-none"
              />

              <button
                type="button"
                className="rounded-full bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </aside>
      </div>
    </main>
  );
}