import type { Metadata } from "next";
import { Building2, MapPinned, ShieldCheck, SlidersHorizontal, Sparkles, Search } from "lucide-react";
import { PropertyCard } from "../components/property-card";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { getFeaturedProperties } from "../lib/api";
import { absoluteUrl, siteConfig } from "../lib/site";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "../lib/seo";
import "./page.css";

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/")
  },
  description: siteConfig.description,
  title: "Verified rental homes in Thailand"
};

const faqs = [
  {
    answer: "FindYourCrib focuses on listings with clearer photos, pricing, location details, and agent accountability so renters can compare homes with less guesswork.",
    question: "How does FindYourCrib make rental search calmer?"
  },
  {
    answer: "The marketplace supports condos, apartments, houses, villas, and serviced apartments across Thailand, starting with renter-heavy destinations such as Bangkok and Phuket.",
    question: "What kinds of homes can I search?"
  },
  {
    answer: "Agents and owners can create listings, manage inquiries, confirm availability, and submit homes for quality review from the dashboard.",
    question: "Can agents list rental properties?"
  }
];

export default async function Home() {
  const properties = await getFeaturedProperties();

  return (
    <main>
      <JsonLd data={organizationJsonLd(siteConfig)} />
      <JsonLd data={websiteJsonLd(siteConfig)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer
            },
            name: faq.question
          }))
        }}
      />
      <SiteHeader />

      <section className="search-band">
        <div className="hero-grid" aria-hidden="true">
          <span className="signal signal-a">BTS</span>
          <span className="signal signal-b">Verified</span>
          <span className="signal signal-c">Rawai</span>
        </div>
        <div className="page-shell search-layout">
          <div className="search-copy">
            <p className="eyebrow">
              <Sparkles size={15} />
              Live-ready rentals, calmer search
            </p>
            <h1>Find verified rental homes in Thailand</h1>
            <p>Search condos, apartments, houses, and villas with cleaner listings, real availability, and agent accountability.</p>
            <div className="hero-proof" aria-label="Platform highlights">
              <span>
                <ShieldCheck size={17} />
                Verified agents
              </span>
              <span>
                <MapPinned size={17} />
                Neighborhood-first
              </span>
              <span>
                <Building2 size={17} />
                Real availability
              </span>
            </div>
          </div>
          <form className="search-panel" action="/properties">
            <label>
              Location
              <input name="query" placeholder="Bangkok, Phuket, Chiang Mai" />
            </label>
            <label>
              Property type
              <select name="propertyType" defaultValue="">
                <option value="">Any type</option>
                <option value="CONDO">Condo</option>
                <option value="APARTMENT">Apartment</option>
                <option value="HOUSE">House</option>
                <option value="VILLA">Villa</option>
              </select>
            </label>
            <label>
              Price range
              <input name="maxPrice" placeholder="Max 50000" inputMode="numeric" />
            </label>
            <input type="hidden" name="sort" value="featured" />
            <button type="submit">
              <Search size={18} />
              Search
            </button>
            <button className="filter-button" type="button" aria-label="More filters">
              <SlidersHorizontal size={19} />
            </button>
          </form>
        </div>
      </section>

      <section className="page-shell insight-strip" aria-label="Search approach">
        <div>
          <span>01</span>
          <p>Start with places, not portals</p>
        </div>
        <div>
          <span>02</span>
          <p>Show fewer but better homes</p>
        </div>
        <div>
          <span>03</span>
          <p>Keep every inquiry accountable</p>
        </div>
      </section>

      <section className="page-shell listings-section">
        <div className="section-heading">
          <div>
            <p>Verified listings</p>
            <h2>Fresh homes worth checking first</h2>
          </div>
          <a href="/properties">View all</a>
        </div>
        <div className="listing-grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section className="page-shell faq-section">
        <div className="section-heading">
          <div>
            <p>Rental search basics</p>
            <h2>Answers before you shortlist</h2>
          </div>
        </div>
        <div className="faq-grid">
          {faqs.map((faq) => (
            <article key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
