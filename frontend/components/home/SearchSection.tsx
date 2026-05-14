import Link from "next/link";

import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/button";

export default function SearchSection() {
  return (
    <section className="bg-white py-12">
      <Container>
        <FadeIn>
          <div className="grid grid-cols-1 gap-4 rounded-3xl bg-gray-50 p-6 shadow-lg md:grid-cols-4">
            <input
              type="text"
              placeholder="Bangkok, Phuket, Chiang Mai..."
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none"
            />

            <select className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none">
              <option>Property Type</option>
              <option>Condo</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>House</option>
            </select>

            <select className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none">
              <option>Price Range</option>
              <option>฿10,000 - ฿20,000</option>
              <option>฿20,000 - ฿50,000</option>
              <option>฿50,000+</option>
            </select>

            <Button
              asChild
              variant="default"
              size="lg"
              className="rounded-xl bg-black text-white hover:bg-gray-800"
            >
              <Link href="/properties">Search</Link>
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}