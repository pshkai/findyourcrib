import Link from "next/link";

import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <DashboardSidebar />

      <main className="min-h-screen flex-1 p-4 sm:p-6 lg:p-10">
        <div className="mb-6 flex gap-3 overflow-x-auto rounded-2xl bg-white p-3 shadow-sm lg:hidden">
          <Link
            href="/dashboard"
            className="whitespace-nowrap rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/listings"
            className="whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold text-gray-700"
          >
            Listings
          </Link>

          <Link
            href="/dashboard/properties/create"
            className="whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold text-gray-700"
          >
            Create
          </Link>
        </div>

        {children}
      </main>
    </div>
  );
}