import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { AuthProvider } from "../components/auth-provider";
import { absoluteUrl, siteConfig } from "../lib/site";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "FindYourCrib | Verified rental homes in Thailand",
    template: "%s | FindYourCrib"
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    title: "FindYourCrib | Verified rental homes in Thailand",
    description: siteConfig.description
  },
  twitter: {
    card: "summary_large_image",
    title: "FindYourCrib | Verified rental homes in Thailand",
    description: siteConfig.description
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
