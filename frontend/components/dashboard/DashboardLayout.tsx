import { ReactNode } from "react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex">
        <DashboardSidebar />

        <section className="flex-1 px-4 py-10 sm:px-6 lg:px-10">
          {children}
        </section>
      </div>
    </main>
  );
}