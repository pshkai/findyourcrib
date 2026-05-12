"use client";

import { useEffect, useState } from "react";

import Container from "@/components/ui/Container";
import PropertyCard from "@/components/PropertyCard";
import LogoutButton from "@/components/auth/LogoutButton";
import { getMyListings } from "@/lib/api";

export default function MyListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadListings() {
      try {
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

    loadListings();
  }, []);

  return (
    <main className="bg-gray-50 py-16 sm:py-20">
      <Container>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
              Agent Dashboard
            </p>

            <h1 className="mt-3 text-4xl font-bold text-gray-900">
              My Listings
            </h1>

            <p className="mt-3 text-gray-600">
              Manage all properties you have created.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <LogoutButton />

            <a
              href="/dashboard/properties/create"
              className="rounded-2xl bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Add Property
            </a>
          </div>
        </div>

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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((property: any) => (
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
                  property.status === "AVAILABLE" ? "Available" : "Rented"
                }
              />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}