export const siteConfig = {
  name: "FindYourCrib",
  description: "Find verified rental homes, condos, apartments, houses, and villas in Thailand.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://findyourcrib.vercel.app"
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
