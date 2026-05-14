"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PropertyCard from "@/components/PropertyCard";
import UploadPropertyImage from "@/components/dashboard/UploadPropertyImage";
import { getMyListings } from "@/lib/api";

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadListings() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("Please login to view your listings.");
        return;
      }

      const data = await getMyListings(token);
      setListings(data);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to load listings.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadListings();
  }, []);

  return (
    <DashboardLayout>
      <DashboardHeader
        title="My Listings"
        description="Manage all properties you have created."
      />

      {isLoading && (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          Loading listings...
        </div>
      )}

      {errorMessage && (
        <div className="rounded-3xl bg-red-50 p-8 text-red-700">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && listings.length === 0 && (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          You do not have any listings yet.
        </div>
      )}

      {!isLoading && !errorMessage && listings.length > 0 && (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {listings.map((property: any) => (
            <div key={property.id} className="space-y-4">
              <PropertyCard
                id={property.id}
                image={
                  property.images?.[0]?.imageUrl ||
                  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
                }
                title={property.title}
                price={`฿${property.price.toLocaleString()}/month`}
                township={property.township}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                propertyType={property.propertyType}
                availability={
                  property.status === "AVAILABLE" ? "Available" : "Rented"
                }
              />

              <UploadPropertyImage
                propertyId={property.id}
                onUploadSuccess={loadListings}
              />
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}