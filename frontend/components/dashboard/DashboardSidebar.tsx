import Link from "next/link";

import {
  Building2,
  LayoutDashboard,
  PlusCircle,
  MessageSquare,
  Settings,
} from "lucide-react";

export default function DashboardSidebar() {
  const links = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Listings",
      href: "/dashboard/listings",
      icon: Building2,
    },
    {
      label: "Add Property",
      href: "/dashboard/properties/create",
      icon: PlusCircle,
    },
    {
      label: "Inquiries",
      href: "/dashboard/inquiries",
      icon: MessageSquare,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden min-h-screen w-72 border-r border-gray-200 bg-white px-6 py-8 lg:block">
      <Link href="/" className="text-2xl font-bold tracking-tight">
        FYC
      </Link>

      <p className="mt-2 text-sm text-gray-500">
        Agent Dashboard
      </p>

      <nav className="mt-10 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}