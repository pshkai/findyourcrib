import { DashboardDataPanel } from "../../../components/dashboard-data-panel";
import "../../page.css";

export default function FavoritesPage() {
  return (
    <main className="page-shell dashboard-page">
      <DashboardDataPanel kind="favorites" />
    </main>
  );
}
