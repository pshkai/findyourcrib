import { PropertyCard } from "../../components/property-card";
import { SiteHeader } from "../../components/site-header";
import { searchProperties } from "../../lib/api";
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
  }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const { properties, meta } = await searchProperties({
    query: params.query,
    propertyType: params.propertyType,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    bedrooms: params.bedrooms ? Number(params.bedrooms) : undefined,
    bathrooms: params.bathrooms ? Number(params.bathrooms) : undefined,
    sort: params.sort ?? "featured"
  });
  const isFallback = Boolean(meta.fallback);

  return (
    <main>
      <SiteHeader />
      <section className="results-hero">
        <div className="page-shell results-header">
          <div>
            <p>Search results</p>
            <h1>Browse verified homes</h1>
          </div>
          {isFallback ? <span>Showing demo listings until the API is running</span> : <span>{properties.length} homes ready to compare</span>}
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
          <button type="submit">Apply</button>
        </form>

        <div className="listing-grid" style={{ marginTop: 24 }}>
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </main>
  );
}
