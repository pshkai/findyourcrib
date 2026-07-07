import { Bath, BedDouble, CheckCircle2, MapPin, Ruler } from "lucide-react";
import type { PropertySummary } from "@findyourcrib/shared";

const formatter = new Intl.NumberFormat("en-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0
});

export function PropertyCard({ property }: { property: PropertySummary }) {
  return (
    <article className="property-card">
      <div
        className="property-image"
        style={{ backgroundImage: property.coverImageUrl ? `url(${property.coverImageUrl})` : undefined }}
      />
      <div className="property-body">
        <div className="property-topline">
          <span>{property.propertyType.replace("_", " ").toLowerCase()}</span>
          {property.isVerified ? (
            <span className="verified">
              <CheckCircle2 size={15} />
              Verified
            </span>
          ) : null}
        </div>
        <h2>{property.title}</h2>
        <p className="price">{formatter.format(property.price)} / month</p>
        <p className="location">
          <MapPin size={16} />
          {property.township}, {property.province}
        </p>
        <div className="facts">
          <span>
            <BedDouble size={16} />
            {property.bedrooms ?? "-"}
          </span>
          <span>
            <Bath size={16} />
            {property.bathrooms ?? "-"}
          </span>
          <span>
            <Ruler size={16} />
            {property.sizeSqm ?? "-"} sqm
          </span>
        </div>
        <a className="property-link" href={`/properties/${property.id}`}>
          View details
        </a>
      </div>
    </article>
  );
}
