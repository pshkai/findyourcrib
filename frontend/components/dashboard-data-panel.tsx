"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle2, Heart, Inbox, LoaderCircle, Trash2 } from "lucide-react";
import {
  confirmListingAvailability,
  deleteListing,
  getAgentInquiries,
  getAgentListings,
  getFavorites,
  removeFavorite,
  type FavoriteSummary,
  type InquirySummary
} from "../lib/dashboard-client";
import { PropertyCard } from "./property-card";

type PanelKind = "listings" | "inquiries" | "favorites";

interface DashboardDataPanelProps {
  kind: PanelKind;
}

export function DashboardDataPanel({ kind }: DashboardDataPanelProps) {
  const [items, setItems] = useState<unknown[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);

  const title = useMemo(() => {
    if (kind === "listings") return "Listing inventory";
    if (kind === "inquiries") return "Inquiries";
    return "Saved homes";
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
    setBusyItemId(propertyId);

    try {
      await removeFavorite(propertyId);
      setItems((current) => current.filter((item) => (item as FavoriteSummary).propertyId !== propertyId));
    } finally {
      setBusyItemId(null);
    }
  }

  async function onConfirmListing(propertyId: string) {
    setBusyItemId(propertyId);

    try {
      const updated = await confirmListingAvailability(propertyId);
      setItems((current) => current.map((item) => ((item as AgentListingSummary).id === propertyId ? updated : item)));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to confirm listing availability");
    } finally {
      setBusyItemId(null);
    }
  }

  async function onDeleteListing(propertyId: string) {
    const shouldDelete = window.confirm("Delete this listing? This cannot be undone.");

    if (!shouldDelete) {
      return;
    }

    setBusyItemId(propertyId);

    try {
      await deleteListing(propertyId);
      setItems((current) => current.filter((item) => (item as AgentListingSummary).id !== propertyId));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to delete listing");
    } finally {
      setBusyItemId(null);
    }
  }

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <div>
          <p>Live data</p>
          <h2>{title}</h2>
        </div>
        {kind === "listings" ? <a href="/dashboard/listings/new">Create listing</a> : <a href="/properties">Browse homes</a>}
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
            const listing = item as AgentListingSummary;
            const isBusy = busyItemId === listing.id;

            return (
              <article className="dashboard-row" key={listing.id}>
                <Building2 size={22} />
                <div>
                  <h2>{listing.title}</h2>
                  <p>
                    {listing.township}, {listing.province} / {listing.status ?? "DRAFT"} / {listing.verificationStatus ?? "PENDING"}
                  </p>
                </div>
                <span>{listing.inquiryCount ?? 0} inquiries</span>
                <div className="dashboard-row-actions">
                  <button disabled={isBusy} type="button" onClick={() => void onConfirmListing(listing.id)}>
                    <CheckCircle2 size={16} />
                    {isBusy ? "Saving" : "Confirm"}
                  </button>
                  <button disabled={isBusy} type="button" onClick={() => void onDeleteListing(listing.id)}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
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
              <button disabled={busyItemId === favorite.propertyId} type="button" onClick={() => void onRemoveFavorite(favorite.propertyId)}>
                <Trash2 size={17} />
                {busyItemId === favorite.propertyId ? "Removing" : "Remove"}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

type AgentListingSummary = Awaited<ReturnType<typeof getAgentListings>>[number];

function EmptyState({ kind }: { kind: PanelKind }) {
  const Icon = kind === "favorites" ? Heart : kind === "inquiries" ? Inbox : Building2;

  return (
    <div className="dashboard-state">
      <Icon size={24} />
      Nothing here yet.
    </div>
  );
}
