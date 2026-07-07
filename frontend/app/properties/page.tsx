import { PropertyCard } from "../../components/property-card";
import { searchProperties } from "../../lib/api";
import type { PropertyType } from "@findyourcrib/shared";

interface PropertiesPageProps {
  searchParams: Promise<{
    query?: string;
    propertyType?: PropertyType;
    maxPrice?: string;
  }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams;
  const { properties, meta } = await searchProperties({
    query: params.query,
    propertyType: params.propertyType,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined
  });
  const isFallback = Boolean(meta.fallback);

  return (
    <main className="page-shell results-page">
      <section className="results-header">
        <div>
          <p>Search results</p>
          <h1>Browse verified homes</h1>
        </div>
        {isFallback ? <span>Showing demo listings until the API is running</span> : null}
      </section>

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
        <input name="maxPrice" placeholder="Max price" inputMode="numeric" defaultValue={params.maxPrice ?? ""} />
        <button type="submit">Apply</button>
      </form>

      <div className="listing-grid" style={{ marginTop: 24 }}>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </main>
  );
}
