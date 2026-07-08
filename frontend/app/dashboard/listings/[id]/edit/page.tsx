"use client";

import { use, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { DashboardShell } from "../../../../../components/dashboard-shell";
import { ListingForm } from "../../../../../components/listing-form";
import { getAgentListing } from "../../../../../lib/dashboard-client";
import type { PropertySummary } from "@findyourcrib/shared";
import "../../../../page.css";

type EditableListing = PropertySummary & {
  description?: string;
  address?: string;
};

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [listing, setListing] = useState<EditableListing | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadListing() {
      setLoading(true);
      setError(null);

      try {
        const data = await getAgentListing(id);

        if (isMounted) {
          setListing(data);
        }
      } catch (caught) {
        if (isMounted) {
          setError(caught instanceof Error ? caught.message : "Unable to load listing");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadListing();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <DashboardShell
      active="listings"
      eyebrow="Agent listing"
      title="Edit listing"
      description="Update property details and send the listing back through verification when important fields change."
    >
      {isLoading ? (
        <div className="dashboard-state">
          <LoaderCircle className="spin" size={24} />
          Loading listing...
        </div>
      ) : null}

      {error ? (
        <div className="dashboard-state error-state">
          Unable to open this listing.
          <span>{error}</span>
          <a href="/dashboard/listings">Back to listings</a>
        </div>
      ) : null}

      {!isLoading && !error && listing ? <ListingForm mode="edit" listing={listing} /> : null}
    </DashboardShell>
  );
}
