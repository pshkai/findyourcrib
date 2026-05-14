import LogoutButton from "@/components/auth/LogoutButton";

interface DashboardHeaderProps {
  title: string;
  description: string;
}

export default function DashboardHeader({
  title,
  description,
}: DashboardHeaderProps) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          Agent Dashboard
        </p>

        <h1 className="mt-3 text-4xl font-bold text-gray-900">
          {title}
        </h1>

        <p className="mt-3 text-gray-600">
          {description}
        </p>
      </div>

      <LogoutButton />
    </div>
  );
}