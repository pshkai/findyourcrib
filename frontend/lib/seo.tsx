import type { Metadata } from "next";

type JsonLdValue = string | number | boolean | null | undefined | JsonLdValue[] | { [key: string]: JsonLdValue };

export const noIndexMetadata: Metadata = {
  robots: {
    follow: false,
    index: false
  }
};

export function JsonLd({ data }: { data: JsonLdValue }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function websiteJsonLd(site: { description: string; name: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description: site.description,
    name: site.name,
    potentialAction: {
      "@type": "SearchAction",
      query: "required name=query",
      target: `${site.url.replace(/\/$/, "")}/properties?query={query}`
    },
    url: site.url
  };
}

export function organizationJsonLd(site: { description: string; name: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    description: site.description,
    name: site.name,
    url: site.url
  };
}
