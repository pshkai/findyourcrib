import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FindYourCrib",
  description: "Find verified homes and rental properties in Thailand."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
