import type { Metadata } from "next";
import { PropertyCard } from "../../components/property-card";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { absoluteUrl } from "../../lib/site";
import { searchProperties } from "../../lib/api";
import { JsonLd } from "../../lib/seo";
import type { PropertySort, PropertyType } from "@findyourcrib/shared";
import "../page.css";

interface PropertiesPageProps {
  searchParams: Promise<{
    query?: string;
    propertyType?: PropertyType;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    bathrooms?: string;
    sort?: PropertySort;
    page?: string;
    pageSize?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Browse verified rental homes",
  description: "Search verified condos, apartments, houses, and villas for rent in Thailand.",
  alternates: {
    canonical: absoluteUrl("/properties")
  },
  openGraph: {
    title: "Browse verified rental homes",
    description: "Search verified condos, apartments, houses, and villas for rent in Thailand.",
    url: absoluteUrl("/properties")
  },
  keywords: ["Thailand rentals", "verified homes for rent", "Bangkok condos", "Phuket villas", "agent-managed listings"]
};

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const page = positiveNumber(params.page, 1);
  const pageSize = positiveNumber(params.pageSize, 12);
  const { properties, meta } = await searchProperties({
    query: params.query,
    propertyType: params.propertyType,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
    bathrooms: params.bathrooms ? Number(params.bathrooms) : undefined,
    sort: params.sort ?? "featured",
    page,
    pageSize
  });
  const isFallback = Boolean(meta.fallback);
  const totalPages = Math.max(1, Math.ceil(meta.total / meta.pageSize));
  const resultStart = meta.total === 0 ? 0 : (meta.page - 1) * meta.pageSize + 1;
  const resultEnd = Math.min(meta.total, meta.page * meta.pageSize);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: properties.map((property, index) => ({
            "@type": "ListItem",
            item: {
              "@type": "Residence",
              address: `${property.township}, ${property.province}`,
              image: property.coverImageUrl ?? undefined,
              name: property.title,
              offers: {
                "@type": "Offer",
                price: property.price,
                priceCurrency: "THB",
                url: absoluteUrl(`/properties/${property.id}`)
              },
              url: absoluteUrl(`/properties/${property.id}`)
            },
            position: index + 1
          })),
          name: "Verified rental homes in Thailand",
          url: absoluteUrl("/properties")
        }}
      />
      <SiteHeader />
      <section className="results-hero">
        <div className="page-shell results-header">
          <div>
            <p>Search results</p>
            <h1>Browse verified homes</h1>
          </div>
          {isFallback ? <span>Showing demo listings until the API is running</span> : <span>{meta.total} homes ready to compare</span>}
        </div>
      </section>

      <section className="page-shell results-page">
        <form className="results-filters" action="/properties">
          <input name="query" placeholder="Location or keyword" defaultValue={params.query ?? ""} />
          <select name="propertyType" defaultValue={params.propertyType ?? ""}>
            <option value="">Any type</option>
            <option value="CONDO">Condo</option>
            <option value="APARTMENT">Apartment</option>
            <option value="HOUSE">House</option>
            <option value="VILLA">Villa</option>
            <option value="SERVICED_APARTMENT">Serviced apartment</option>
          </select>
          <input name="minPrice" placeholder="Min price" inputMode="numeric" defaultValue={params.minPrice ?? ""} />
          <input name="maxPrice" placeholder="Max price" inputMode="numeric" defaultValue={params.maxPrice ?? ""} />
          <select name="bedrooms" defaultValue={params.bedrooms ?? ""}>
            <option value="">Beds</option>
            <option value="1">1+ beds</option>
            <option value="2">2+ beds</option>
            <option value="3">3+ beds</option>
            <option value="4">4+ beds</option>
          </select>
          <select name="bathrooms" defaultValue={params.bathrooms ?? ""}>
            <option value="">Baths</option>
            <option value="1">1+ baths</option>
            <option value="2">2+ baths</option>
            <option value="3">3+ baths</option>
          </select>
          <select name="sort" defaultValue={params.sort ?? "featured"}>
            <option value="featured">Featured first</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price low to high</option>
            <option value="price_desc">Price high to low</option>
          </select>
          <select name="pageSize" defaultValue={String(pageSize)}>
            <option value="12">12 per page</option>
            <option value="24">24 per page</option>
            <option value="36">36 per page</option>
          </select>
          <input type="hidden" name="page" value="1" />
          <button type="submit">Apply</button>
        </form>

        <div className="results-summary">
          <span>
            Showing {resultStart}-{resultEnd} of {meta.total}
          </span>
          <span>
            Page {meta.page} of {totalPages}
          </span>
        </div>

        {properties.length > 0 ? (
          <div className="listing-grid" style={{ marginTop: 18 }}>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="dashboard-state results-empty">No homes match these filters yet.</div>
        )}

        <nav className="pagination" aria-label="Property result pages">
          {meta.page > 1 ? <a href={buildPageHref(params, meta.page - 1, pageSize)}>Previous</a> : <span>Previous</span>}
          <strong>{meta.page}</strong>
          {meta.page < totalPages ? <a href={buildPageHref(params, meta.page + 1, pageSize)}>Next</a> : <span>Next</span>}
        </nav>
      </section>
      <SiteFooter />
    </main>
  );
}

function positiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function buildPageHref(params: Awaited<PropertiesPageProps["searchParams"]>, page: number, pageSize: number) {
  const nextParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value && key !== "page") {
      nextParams.set(key, value);
    }
  }

  nextParams.set("page", String(page));
  nextParams.set("pageSize", String(pageSize));

  return `/properties?${nextParams.toString()}`;
}
