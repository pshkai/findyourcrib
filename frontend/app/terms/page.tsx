import type { Metadata } from "next";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { absoluteUrl } from "../../lib/site";
import "../page.css";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "FindYourCrib terms for renters, agents, owners, listings, inquiries, and marketplace use.",
  alternates: { canonical: absoluteUrl("/terms") }
};

export default function TermsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-shell content-page legal-page">
        <p>Terms of Service</p>
        <h1>Use FindYourCrib responsibly</h1>
        <section>
          <h2>Marketplace role</h2>
          <p>FindYourCrib helps renters discover listings and contact agents or owners. We are not a party to rental contracts or payments arranged outside the platform.</p>
        </section>
        <section>
          <h2>Listings</h2>
          <p>Agents and owners are responsible for accurate pricing, availability, photos, descriptions, and legal authority to advertise each property.</p>
        </section>
        <section>
          <h2>Acceptable use</h2>
          <p>Do not submit false listings, spam inquiries, scrape the service, bypass security, or misuse contact information shared through inquiries.</p>
        </section>
        <section>
          <h2>Moderation</h2>
          <p>We may verify, reject, hide, or feature listings to protect marketplace quality and user trust.</p>
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}
