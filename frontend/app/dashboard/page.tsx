import { Building2, Heart, Inbox, PlusCircle } from "lucide-react";
import { DashboardShell } from "../../components/dashboard-shell";
import "../page.css";

const actions = [
  { label: "Create listing", href: "/dashboard/listings/new", icon: PlusCircle },
  { label: "My listings", href: "/dashboard/listings", icon: Building2 },
  { label: "Inquiries", href: "/dashboard/inquiries", icon: Inbox },
  { label: "Favorites", href: "/dashboard/favorites", icon: Heart }
];

export default function DashboardPage() {
  return (
    <DashboardShell
      active="overview"
      title="Manage your FindYourCrib activity"
      description="Create listings, follow renter interest, and keep saved homes close while the marketplace grows."
    >
      <section className="dashboard-grid">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <a className="dashboard-action" key={action.href} href={action.href}>
              <Icon size={24} />
              <span>{action.label}</span>
            </a>
          );
        })}
      </section>
    </DashboardShell>
  );
}
