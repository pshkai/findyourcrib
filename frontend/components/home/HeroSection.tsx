import Image from "next/image";
import Link from "next/link";
import { Building2, House, Search, ShieldCheck } from "lucide-react";

import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
          alt="Luxury property in Thailand"
          fill
          priority
          loading="eager"
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />

      <Container className="relative z-10 py-20">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <FadeIn>
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                <ShieldCheck size={18} className="text-blue-400" />
                <span className="text-sm font-medium">
                  Verified rentals across Thailand
                </span>
              </div>

              <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
                Find Your
                <span className="block text-blue-400">Perfect Home</span>
                In Thailand
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-gray-200 sm:text-lg">
                Discover condos, apartments, rooms, and villas in Bangkok,
                Chiang Mai, Phuket, and other popular areas with verified
                property listings.
              </p>

              <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
                <div className="flex flex-col gap-4 lg:flex-row">
                  <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-5 py-4">
                    <Search size={20} className="text-gray-400" />

                    <input
                      type="text"
                      placeholder="Search Bangkok, Chiang Mai, Phuket..."
                      className="w-full bg-transparent text-black outline-none"
                    />
                  </div>

                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="rounded-2xl bg-blue-600 px-8 py-4 text-white hover:bg-blue-700"
                  >
                    <Link href="/properties">Search</Link>
                  </Button>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-8">
                <div>
                  <h3 className="text-3xl font-bold">500+</h3>
                  <p className="text-sm text-gray-300">Thai Listings</p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold">98%</h3>
                  <p className="text-sm text-gray-300">Verified Properties</p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold">24/7</h3>
                  <p className="text-sm text-gray-300">Inquiry Support</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="relative hidden h-[500px] lg:block">
            <FadeIn delay={0.2}>
              <div className="absolute right-0 top-16 w-72 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-blue-500/20 p-4">
                    <House className="text-blue-400" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-300">Properties Listed</p>
                    <h3 className="text-3xl font-bold">1,200+</h3>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.35}>
              <div className="absolute bottom-16 left-0 w-72 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-purple-500/20 p-4">
                    <Building2 className="text-purple-400" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-300">Trusted Agents</p>
                    <h3 className="text-3xl font-bold">300+</h3>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}