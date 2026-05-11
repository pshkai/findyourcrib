import Container from "@/components/ui/Container";

export default function CTASection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>

        <div className="rounded-3xl bg-black px-6 py-14 text-center text-white sm:px-10 sm:py-20">

          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-blue-400">
            Get Started
          </p>

          <h2 className="text-3xl font-bold sm:text-4xl">
            List Your Property With FYC
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base text-gray-300 sm:text-lg">
            Reach thousands of renters and buyers looking for their next home.
          </p>

          <button className="mt-8 rounded-xl bg-white px-8 py-4 font-medium text-black transition hover:bg-gray-200">
            Add Property
          </button>
        </div>

      </Container>
    </section>
  );
}