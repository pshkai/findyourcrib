import type { Metadata } from "next";
import { Bath, BedDouble, CheckCircle2, MapPin, Ruler, TrainFront } from "lucide-react";
import { FavoriteButton } from "../../../components/favorite-button";
import { InquiryForm } from "../../../components/inquiry-form";
import { SiteFooter } from "../../../components/site-footer";
import { SiteHeader } from "../../../components/site-header";
import { getPropertyDetail } from "../../../lib/api";
import { absoluteUrl } from "../../../lib/site";
import "../../page.css";

const formatter = new Intl.NumberFormat("en-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0
});

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { property } = await getPropertyDetail(id);
  const title = `${property.title} in ${property.township}`;
  const description = `${property.propertyType.replace("_", " ").toLowerCase()} for rent in ${property.township}, ${property.province} at ${formatter.format(property.price)} per month.`;
  const image = property.images[0]?.imageUrl ?? property.coverImageUrl ?? undefined;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/properties/${property.id}`)
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/properties/${property.id}`),
      images: image ? [{ url: image, alt: property.title }] : undefined
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined
    }
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  const { property, isFallback } = await getPropertyDetail(id);
  const heroImage = property.images[0]?.imageUrl ?? property.coverImageUrl;

  return (
    <main className="property-detail-page">
      <SiteHeader />
      <section className="property-hero" style={{ backgroundImage: heroImage ? `url(${heroImage})` : undefined }}>
        <div className="page-shell property-hero-content">
          <a href="/properties">Browse properties</a>
          <h1>{property.title}</h1>
          <p>
            <MapPin size={18} />
            {property.address || `${property.township}, ${property.province}`}
          </p>
          <FavoriteButton propertyId={property.id} variant="detail" />
        </div>
      </section>

      <section className="page-shell property-detail-layout">
        <article className="property-main">
          {isFallback ? <div className="fallback-note">Showing demo details until the API is running.</div> : null}
          <div className="property-detail-topline">
            <span>{property.propertyType.replace("_", " ").toLowerCase()}</span>
            {property.isVerified ? (
              <span className="verified">
                <CheckCircle2 size={16} />
                Verified
              </span>
            ) : null}
          </div>
          <h2>{formatter.format(property.price)} / month</h2>
          <p className="property-description">{property.description}</p>

          <div className="detail-facts">
            <span>
              <BedDouble size={18} />
              {property.bedrooms ?? "-"} beds
            </span>
            <span>
              <Bath size={18} />
              {property.bathrooms ?? "-"} baths
            </span>
            <span>
              <Ruler size={18} />
              {property.sizeSqm ?? "-"} sqm
            </span>
            <span>
              <TrainFront size={18} />
              {property.nearestStation ?? "Station not listed"}
            </span>
          </div>

          {property.images.length > 1 ? (
            <div className="detail-gallery">
              {property.images.slice(1).map((image) => (
                <img key={image.imageUrl} src={image.imageUrl} alt={image.altText ?? property.title} />
              ))}
            </div>
          ) : null}
        </article>

        <aside className="inquiry-panel">
          <div>
            <p>Listed by</p>
            <h2>{property.agent?.name ?? "Agent"}</h2>
            {property.agent?.phoneNumber ? <span>{property.agent.phoneNumber}</span> : null}
          </div>
          <InquiryForm propertyId={property.id} />
        </aside>
      </section>
      <SiteFooter />
    </main>
  );
}
