import type { MetadataRoute } from "next";
import { getFeaturedProperties } from "../lib/api";
import { absoluteUrl } from "../lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const properties = await getFeaturedProperties();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: absoluteUrl("/properties"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9
    },
    ...properties.map((property) => ({
      url: absoluteUrl(`/properties/${property.id}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: property.isVerified ? 0.8 : 0.6
    }))
  ];
}
