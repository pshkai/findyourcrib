import Image from "next/image";
import { notFound } from "next/navigation";

import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";

import Container from "@/components/ui/Container";
import InquiryForm from "@/components/properties/InquiryForm";

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

  if (!property || property.status === "HIDDEN") {
    notFound();
  }

  const mainImage =
    property.images?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85";

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="relative h-[500px] overflow-hidden rounded-3xl">
              <Image
                src={mainImage}
                alt={property.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>

            {property.images?.length > 1 && (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {property.images.map((image: any) => (
                  <div
                    key={image.id}
                    className="relative h-32 overflow-hidden rounded-2xl"
                  >
                    <Image
                      src={image.imageUrl}
                      alt={property.title}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                  {property.status}
                </div>

                <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                  {property.propertyType}
                </div>

                {property.verificationStatus && (
                  <div className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
                    Verified
                  </div>
                )}
              </div>

              <h1 className="mt-6 text-4xl font-bold text-gray-900">
                {property.title}
              </h1>

              <div className="mt-4 flex items-center gap-2 text-gray-600">
                <MapPin size={18} />
                <span>
                  {property.address}, {property.township}
                </span>
              </div>

              <p className="mt-8 leading-8 text-gray-700">
                {property.description}
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-gray-50 p-5">
                  <div className="flex items-center gap-3">
                    <BedDouble />
                    <div>
                      <p className="text-sm text-gray-500">Bedrooms</p>
                      <h3 className="font-semibold">{property.bedrooms}</h3>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 p-5">
                  <div className="flex items-center gap-3">
                    <Bath />
                    <div>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                      <h3 className="font-semibold">{property.bathrooms}</h3>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 p-5">
                  <div className="flex items-center gap-3">
                    <Ruler />
                    <div>
                      <p className="text-sm text-gray-500">Size</p>
                      <h3 className="font-semibold">
                        {property.sizeSqm} sqm
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {property.nearestStation && (
                <div className="mt-8 rounded-2xl bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">Nearest Station</p>
                  <h3 className="mt-1 font-semibold text-gray-900">
                    {property.nearestStation}
                    {property.distanceToStation
                      ? ` • ${property.distanceToStation} km`
                      : ""}
                  </h3>
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-3xl bg-white p-8 shadow-sm lg:sticky lg:top-28">
            <p className="text-sm text-gray-500">Monthly Rent</p>

            <h2 className="mt-2 text-4xl font-bold text-gray-900">
              ฿{property.price.toLocaleString()}
            </h2>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900">
                Agent Information
              </h3>

              <div className="mt-4">
                <p className="font-medium">{property.agent?.name}</p>

                <p className="text-sm text-gray-600">
                  {property.agent?.email}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900">Send Inquiry</h3>

              <InquiryForm propertyId={id} />
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}