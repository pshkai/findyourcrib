import { DashboardDataPanel } from "../../../components/dashboard-data-panel";
import "../../page.css";

export default function ListingsPage() {
  return (
    <main className="page-shell dashboard-page">
      <DashboardDataPanel kind="listings" />
    </main>
  );
}
