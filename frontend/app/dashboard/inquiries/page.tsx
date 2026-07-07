import { DashboardDataPanel } from "../../../components/dashboard-data-panel";
import { DashboardShell } from "../../../components/dashboard-shell";
import "../../page.css";

export default function InquiriesPage() {
  return (
    <DashboardShell active="inquiries" title="Inquiries" description="Review renter messages and respond while the listing context is still fresh.">
      <DashboardDataPanel kind="inquiries" />
    </DashboardShell>
  );
}
