"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

import { addFavorite, removeFavorite } from "@/lib/api";

interface FavoriteButtonProps {
  propertyId: number;
}

export default function FavoriteButton({
  propertyId,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleFavorite() {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setIsLoading(true);

      if (isFavorite) {
        await removeFavorite(token, propertyId);
        setIsFavorite(false);
      } else {
        await addFavorite(token, propertyId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update favorites");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleFavorite}
      disabled={isLoading}
      className="rounded-full bg-white/90 p-2 shadow-lg backdrop-blur transition hover:scale-110 disabled:opacity-60"
    >
      <Heart
        size={18}
        className={
          isFavorite
            ? "fill-red-500 text-red-500"
            : "text-gray-700"
        }
      />
    </button>
  );
}