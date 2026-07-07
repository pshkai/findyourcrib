import { DashboardDataPanel } from "../../../components/dashboard-data-panel";
import { DashboardShell } from "../../../components/dashboard-shell";
import "../../page.css";

export default function FavoritesPage() {
  return (
    <DashboardShell active="favorites" title="Favorites" description="Keep a shortlist of homes worth revisiting before scheduling viewings.">
      <DashboardDataPanel kind="favorites" />
    </DashboardShell>
  );
}
