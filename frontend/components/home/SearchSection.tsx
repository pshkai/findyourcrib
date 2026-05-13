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
              placeholder="Location"
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none"
            />

            <select className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none">
              <option>Property Type</option>
              <option>Apartment</option>
              <option>House</option>
              <option>Villa</option>
            </select>

            <select className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none">
              <option>Price Range</option>
              <option>$100-$500</option>
              <option>$500-$1000</option>
            </select>

            <Button
              variant="default"
              size="lg"
              className="rounded-xl bg-black text-white hover:bg-gray-800"
            >
              Search
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}