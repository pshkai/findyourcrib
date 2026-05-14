"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PropertyCard from "@/components/PropertyCard";
import { getFavorites } from "@/lib/api";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadFavorites() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setErrorMessage("Please login to view favorites.");
          return;
        }

        const data = await getFavorites(token);

        setFavorites(data);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Failed to fetch favorites");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadFavorites();
  }, []);

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Saved Properties"
        description="Your favorite Thailand property listings."
      />

      {isLoading && (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          Loading favorites...
        </div>
      )}

      {errorMessage && (
        <div className="rounded-3xl bg-red-50 p-8 text-red-700">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && favorites.length === 0 && (
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          No saved properties yet.
        </div>
      )}

      {!isLoading && !errorMessage && favorites.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map((favorite: any) => {
            const property = favorite.property || favorite;

            return (
              <PropertyCard
                key={property.id}
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
                  property.status === "AVAILABLE"
                    ? "Available"
                    : "Rented"
                }
              />
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}