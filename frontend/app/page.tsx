import HeroSection from "@/components/home/HeroSection";
import SearchSection from "@/components/home/SearchSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SearchSection />
      <FeaturedProperties />
      <CTASection />
    </main>
  );
}