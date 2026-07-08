import type { Metadata } from "next";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { absoluteUrl } from "../../lib/site";
import "../page.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How FindYourCrib handles account, listing, inquiry, and usage information.",
  alternates: { canonical: absoluteUrl("/privacy") }
};

export default function PrivacyPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-shell content-page legal-page">
        <p>Privacy Policy</p>
        <h1>How we handle information</h1>
        <section>
          <h2>Information we collect</h2>
          <p>We collect account details, listing information, saved homes, inquiry messages, and technical information needed to operate and secure the service.</p>
        </section>
        <section>
          <h2>How we use it</h2>
          <p>We use information to show listings, route inquiries, manage dashboards, prevent abuse, improve search quality, and support marketplace trust and moderation.</p>
        </section>
        <section>
          <h2>Sharing</h2>
          <p>Inquiry contact details are shared with the relevant listing agent or owner. We do not sell personal information.</p>
        </section>
        <section>
          <h2>Contact</h2>
          <p>For privacy questions or removal requests, contact support@findyourcrib.com.</p>
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}
