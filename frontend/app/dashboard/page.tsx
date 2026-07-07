import { Building2, Heart, Inbox, PlusCircle } from "lucide-react";
import "../page.css";

const actions = [
  { label: "Create listing", href: "/dashboard/listings/new", icon: PlusCircle },
  { label: "My listings", href: "/dashboard/listings", icon: Building2 },
  { label: "Inquiries", href: "/dashboard/inquiries", icon: Inbox },
  { label: "Favorites", href: "/dashboard/favorites", icon: Heart }
];

export default function DashboardPage() {
  return (
    <main className="page-shell dashboard-page">
      <section className="dashboard-header">
        <p>Workspace</p>
        <h1>Manage your FindYourCrib activity</h1>
      </section>
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
    </main>
  );
}
