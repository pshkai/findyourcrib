import { ListingForm } from "../../../../components/listing-form";
import { DashboardShell } from "../../../../components/dashboard-shell";
import "../../../page.css";

export default function NewListingPage() {
  return (
    <DashboardShell active="new-listing" eyebrow="Agent listing" title="Create a listing" description="Add the essentials now; richer media and verification workflows can layer on next.">
      <ListingForm />
    </DashboardShell>
  );
}
