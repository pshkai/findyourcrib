"use client";

import { useEffect, useState } from "react";
import { Heart, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { addFavorite, getFavorites, removeFavorite } from "../lib/dashboard-client";

type FavoriteVariant = "card" | "detail";

let favoriteIdsCache: Set<string> | null = null;
let favoriteIdsPromise: Promise<Set<string>> | null = null;

async function loadFavoriteIds() {
  if (favoriteIdsCache) {
    return favoriteIdsCache;
  }

  favoriteIdsPromise ??= getFavorites().then((favorites) => {
    favoriteIdsCache = new Set(favorites.map((favorite) => favorite.propertyId));
    favoriteIdsPromise = null;
    return favoriteIdsCache;
  });

  return favoriteIdsPromise;
}

function updateCache(propertyId: string, isFavorite: boolean) {
  favoriteIdsCache ??= new Set();

  if (isFavorite) {
    favoriteIdsCache.add(propertyId);
  } else {
    favoriteIdsCache.delete(propertyId);
  }
}

export function FavoriteButton({ propertyId, variant = "card" }: { propertyId: string; variant?: FavoriteVariant }) {
  const router = useRouter();
  const { status } = useAuth();
  const [isFavorite, setFavorite] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function hydrateFavorite() {
      if (status !== "authenticated") {
        setFavorite(false);
        return;
      }

      try {
        const favoriteIds = await loadFavoriteIds();

        if (isMounted) {
          setFavorite(favoriteIds.has(propertyId));
        }
      } catch {
        if (isMounted) {
          setError("Unable to load saved state");
        }
      }
    }

    void hydrateFavorite();

    return () => {
      isMounted = false;
    };
  }, [propertyId, status]);

  async function onToggle() {
    setError(null);

    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      if (isFavorite) {
        await removeFavorite(propertyId);
        updateCache(propertyId, false);
        setFavorite(false);
      } else {
        await addFavorite(propertyId);
        updateCache(propertyId, true);
        setFavorite(true);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update saved home");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`favorite-control favorite-control-${variant}`}>
      <button aria-pressed={isFavorite} disabled={isLoading} type="button" onClick={() => void onToggle()}>
        {isLoading ? <LoaderCircle className="spin" size={16} /> : <Heart fill={isFavorite ? "currentColor" : "none"} size={16} />}
        {isFavorite ? "Saved" : "Save"}
      </button>
      {error ? <span>{error}</span> : null}
    </div>
  );
}
