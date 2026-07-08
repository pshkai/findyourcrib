"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, EyeOff, LoaderCircle, ShieldCheck, Star, XCircle } from "lucide-react";
import {
  featureAdminListing,
  getAdminReviewQueue,
  hideAdminListing,
  rejectAdminListing,
  verifyAdminListing,
  type AdminReviewListing
} from "../lib/dashboard-client";

export function AdminReviewPanel() {
  const [items, setItems] = useState<AdminReviewListing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadQueue() {
      setLoading(true);
      setError(null);

      try {
        const queue = await getAdminReviewQueue();

        if (isMounted) {
          setItems(queue);
        }
      } catch (caught) {
        if (isMounted) {
          setError(caught instanceof Error ? caught.message : "Unable to load review queue");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadQueue();

    return () => {
      isMounted = false;
    };
  }, []);

  async function runAction(propertyId: string, action: "verify" | "reject" | "feature" | "hide") {
    setBusyItemId(propertyId);
    setError(null);

    try {
      if (action === "verify") {
        await verifyAdminListing(propertyId);
        setItems((current) => current.filter((item) => item.id !== propertyId));
      } else if (action === "reject") {
        await rejectAdminListing(propertyId);
        setItems((current) => current.filter((item) => item.id !== propertyId));
      } else if (action === "feature") {
        const updated = await featureAdminListing(propertyId);
        setItems((current) => current.map((item) => (item.id === propertyId ? updated : item)));
      } else {
        await hideAdminListing(propertyId);
        setItems((current) => current.filter((item) => item.id !== propertyId));
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update listing");
    } finally {
      setBusyItemId(null);
    }
  }

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <div>
          <p>Moderation</p>
          <h2>Pending listings</h2>
        </div>
        <a href="/properties">View public marketplace</a>
      </div>

      {isLoading ? (
        <div className="dashboard-state">
          <LoaderCircle className="spin" size={24} />
          Loading review queue...
        </div>
      ) : null}

      {error ? (
        <div className="dashboard-state error-state">
          Unable to load admin review queue.
          <span>{error}</span>
        </div>
      ) : null}

      {!isLoading && !error && items.length === 0 ? (
        <div className="dashboard-state">
          <ShieldCheck size={24} />
          No pending listings need review.
        </div>
      ) : null}

      {!isLoading && !error && items.length > 0 ? (
        <div className="dashboard-list">
          {items.map((listing) => {
            const isBusy = busyItemId === listing.id;

            return (
              <article className="admin-review-row" key={listing.id}>
                <div
                  className="admin-review-image"
                  style={{ backgroundImage: listing.coverImageUrl ? `url(${listing.coverImageUrl})` : undefined }}
                />
                <div className="admin-review-body">
                  <div className="inquiry-title-line">
                    <h2>{listing.title}</h2>
                    <span>{listing.verificationStatus ?? "PENDING"}</span>
                  </div>
                  <p>
                    {listing.township}, {listing.province} / {listing.propertyType.replace("_", " ").toLowerCase()} / THB{" "}
                    {listing.price.toLocaleString("en-TH")}
                  </p>
                  <p>
                    Agent: {listing.agent?.name ?? "Unknown"}
                    {listing.agent?.email ? ` / ${listing.agent.email}` : ""}
                  </p>
                  <div className="dashboard-row-actions admin-review-actions">
                    <button disabled={isBusy} type="button" onClick={() => void runAction(listing.id, "verify")}>
                      <CheckCircle2 size={16} />
                      Verify
                    </button>
                    <button disabled={isBusy} type="button" onClick={() => void runAction(listing.id, "reject")}>
                      <XCircle size={16} />
                      Reject
                    </button>
                    <button disabled={isBusy} type="button" onClick={() => void runAction(listing.id, "feature")}>
                      <Star size={16} />
                      Feature
                    </button>
                    <button disabled={isBusy} type="button" onClick={() => void runAction(listing.id, "hide")}>
                      <EyeOff size={16} />
                      Hide
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
