"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { getMyDashboard } from "@/lib/api";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState({
    totalListings: 0,
    bookedListings: 0,
    inquiries: 0,
    availableListings: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setErrorMessage("Please login to view your dashboard.");
          return;
        }

        const data = await getMyDashboard(token);

        setDashboard({
          totalListings: data.totalListings || 0,
          bookedListings: data.bookedListings || 0,
          inquiries: data.inquiries || 0,
          availableListings: data.availableListings || 0,
        });
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Failed to load dashboard.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Dashboard Overview"
        description="Manage your property listings, inquiries, and account activity."
      />

      {isLoading && (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          Loading dashboard...
        </div>
      )}

      {errorMessage && (
        <div className="rounded-3xl bg-red-50 p-8 text-red-700">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Listings</p>
              <h2 className="mt-3 text-4xl font-bold text-gray-900">
                {dashboard.totalListings}
              </h2>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Booked Listings</p>
              <h2 className="mt-3 text-4xl font-bold text-gray-900">
                {dashboard.bookedListings}
              </h2>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Inquiries</p>
              <h2 className="mt-3 text-4xl font-bold text-gray-900">
                {dashboard.inquiries}
              </h2>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Available</p>
              <h2 className="mt-3 text-4xl font-bold text-gray-900">
                {dashboard.availableListings}
              </h2>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Quick Actions
              </h2>

              <div className="mt-6 grid gap-4">
                <a
                  href="/dashboard/properties/create"
                  className="rounded-2xl bg-black px-5 py-4 text-center text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Add New Property
                </a>

                <a
                  href="/dashboard/listings"
                  className="rounded-2xl border border-gray-200 px-5 py-4 text-center text-sm font-medium transition hover:bg-gray-100"
                >
                  View My Listings
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Activity
              </h2>

              <p className="mt-6 text-gray-600">
                No recent activity yet.
              </p>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}