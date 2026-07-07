import { DashboardDataPanel } from "../../../components/dashboard-data-panel";
import "../../page.css";

export default function InquiriesPage() {
  return (
    <main className="page-shell dashboard-page">
      <DashboardDataPanel kind="inquiries" />
    </main>
  );
}
