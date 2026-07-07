"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Heart, Inbox, LoaderCircle, Trash2 } from "lucide-react";
import { getAgentInquiries, getAgentListings, getFavorites, removeFavorite, type FavoriteSummary, type InquirySummary } from "../lib/dashboard-client";
import { PropertyCard } from "./property-card";

type PanelKind = "listings" | "inquiries" | "favorites";

interface DashboardDataPanelProps {
  kind: PanelKind;
}

export function DashboardDataPanel({ kind }: DashboardDataPanelProps) {
  const [items, setItems] = useState<unknown[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  const title = useMemo(() => {
    if (kind === "listings") return "My listings";
    if (kind === "inquiries") return "Inquiries";
    return "Favorites";
  }, [kind]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data =
          kind === "listings"
            ? await getAgentListings()
            : kind === "inquiries"
              ? await getAgentInquiries()
              : await getFavorites();

        if (isMounted) {
          setItems(data);
        }
      } catch (caught) {
        if (isMounted) {
          setError(caught instanceof Error ? caught.message : "Unable to load dashboard data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [kind]);

  async function onRemoveFavorite(propertyId: string) {
    await removeFavorite(propertyId);
    setItems((current) => current.filter((item) => (item as FavoriteSummary).propertyId !== propertyId));
  }

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <div>
          <p>{kind}</p>
          <h1>{title}</h1>
        </div>
        <a href="/dashboard">Dashboard</a>
      </div>

      {isLoading ? (
        <div className="dashboard-state">
          <LoaderCircle className="spin" size={24} />
          Loading {title.toLowerCase()}...
        </div>
      ) : null}

      {error ? (
        <div className="dashboard-state error-state">
          Login as an agent or renter to view this page.
          <span>{error}</span>
          <a href="/login">Login</a>
        </div>
      ) : null}

      {!isLoading && !error && items.length === 0 ? <EmptyState kind={kind} /> : null}

      {!isLoading && !error && kind === "listings" ? (
        <div className="dashboard-list">
          {items.map((item) => {
            const listing = item as ReturnType<typeof getAgentListings> extends Promise<Array<infer T>> ? T : never;
            return (
              <article className="dashboard-row" key={listing.id}>
                <Building2 size={22} />
                <div>
                  <h2>{listing.title}</h2>
                  <p>
                    {listing.township}, {listing.province} · {listing.status} · {listing.verificationStatus}
                  </p>
                </div>
                <span>{listing.inquiryCount ?? 0} inquiries</span>
              </article>
            );
          })}
        </div>
      ) : null}

      {!isLoading && !error && kind === "inquiries" ? (
        <div className="dashboard-list">
          {(items as InquirySummary[]).map((inquiry) => (
            <article className="dashboard-row inquiry-row" key={inquiry.id}>
              <Inbox size={22} />
              <div>
                <h2>{inquiry.contactName}</h2>
                <p>
                  {inquiry.property.title} · {inquiry.contactEmail}
                </p>
                <blockquote>{inquiry.message}</blockquote>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {!isLoading && !error && kind === "favorites" ? (
        <div className="favorites-grid">
          {(items as FavoriteSummary[]).map((favorite) => (
            <div className="favorite-item" key={favorite.propertyId}>
              <PropertyCard property={favorite.property} />
              <button type="button" onClick={() => void onRemoveFavorite(favorite.propertyId)}>
                <Trash2 size={17} />
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function EmptyState({ kind }: { kind: PanelKind }) {
  const Icon = kind === "favorites" ? Heart : kind === "inquiries" ? Inbox : Building2;

  return (
    <div className="dashboard-state">
      <Icon size={24} />
      Nothing here yet.
    </div>
  );
}
