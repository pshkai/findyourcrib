import { DashboardDataPanel } from "../../../components/dashboard-data-panel";
import { DashboardShell } from "../../../components/dashboard-shell";
import "../../page.css";

export default function ListingsPage() {
  return (
    <DashboardShell active="listings" title="My listings" description="Track live inventory, verification state, and renter demand from one tidy workspace.">
      <DashboardDataPanel kind="listings" />
    </DashboardShell>
  );
}
