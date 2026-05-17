import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          Dashboard
        </p>

        <h1 className="mt-3 text-5xl font-bold text-gray-900">
          Agent Dashboard
        </h1>

        <p className="mt-4 text-gray-600">
          Manage your listings and monitor property activity.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-500">Total Listings</p>

            <h2 className="mt-3 text-4xl font-bold text-gray-900">12</h2>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-500">Available Properties</p>

            <h2 className="mt-3 text-4xl font-bold text-gray-900">8</h2>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-500">Booked Listings</p>

            <h2 className="mt-3 text-4xl font-bold text-gray-900">4</h2>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}