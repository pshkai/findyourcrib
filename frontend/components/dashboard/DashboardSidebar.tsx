"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "My Listings",
    href: "/dashboard/listings",
  },
  {
    label: "Create Property",
    href: "/dashboard/properties/create",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 border-r border-gray-200 bg-white lg:block">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900">Agent Panel</h2>

        <div className="mt-10 flex flex-col gap-3">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-2xl px-5 py-4 text-sm font-semibold transition ${
                  active
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}