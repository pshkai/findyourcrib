import Image from "next/image";

import Container from "@/components/ui/Container";
import PropertiesClient from "@/components/properties/PropertiesClient";
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
  );
}