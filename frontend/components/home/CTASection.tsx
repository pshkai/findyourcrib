import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <FadeIn>
          <div className="rounded-3xl bg-black px-6 py-14 text-center text-white sm:px-10 sm:py-20">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-blue-400">
              For Property Owners
            </p>

            <h2 className="text-3xl font-bold sm:text-4xl">
              List Your Property With FYC
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base text-gray-300 sm:text-lg">
              Reach renters looking for condos, apartments, rooms, and villas
              across Thailand.
            </p>

            <Button
              variant="secondary"
              size="lg"
              className="mt-8 rounded-xl bg-white text-black hover:bg-gray-200"
            >
              Add Property
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}