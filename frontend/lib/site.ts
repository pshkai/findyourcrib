export const siteConfig = {
  name: "FindYourCrib",
  description:
    "Search verified rental homes in Thailand, including Bangkok condos, Phuket villas, apartments, houses, and agent-managed listings with clearer availability.",
  keywords: [
    "Thailand rentals",
    "Bangkok condos for rent",
    "Phuket villas for rent",
    "verified rental homes",
    "apartments in Thailand",
    "FindYourCrib"
  ],
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://findyourcrib.vercel.app"
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
