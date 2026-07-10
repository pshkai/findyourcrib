import { AdminReviewPanel } from "../../components/admin-review-panel";
import { DashboardShell } from "../../components/dashboard-shell";
import { noIndexMetadata } from "../../lib/seo";
import "../page.css";

export const metadata = noIndexMetadata;

export default function AdminPage() {
  return (
    <DashboardShell
      active="admin-review"
      eyebrow="Admin"
      title="Review listing quality"
      description="Verify trustworthy homes, reject weak submissions, and feature listings that deserve more visibility."
      requireAdmin
    >
      <AdminReviewPanel />
    </DashboardShell>
  );
}
