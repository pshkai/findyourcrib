import DashboardSidebar from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex bg-gray-50">
      <DashboardSidebar />

      <main className="min-h-screen flex-1 p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}