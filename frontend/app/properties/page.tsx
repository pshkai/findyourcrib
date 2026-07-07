import { PropertyCard } from "../../components/property-card";
import { featuredProperties } from "../../lib/mock-data";

export default function PropertiesPage() {
  return (
    <main className="page-shell" style={{ paddingBottom: 64, paddingTop: 32 }}>
      <h1>Browse properties</h1>
      <p style={{ color: "var(--muted)", maxWidth: 680 }}>
        This page will connect to `GET /api/v1/properties`. The first scaffold keeps the result UI available while backend data is wired in.
      </p>
      <div className="listing-grid" style={{ marginTop: 24 }}>
        {featuredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </main>
  );
}
