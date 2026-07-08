import type { Metadata } from "next";
import { Mail, ShieldCheck } from "lucide-react";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { absoluteUrl } from "../../lib/site";
import "../page.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact FindYourCrib for listing, account, moderation, or partnership questions.",
  alternates: { canonical: absoluteUrl("/contact") }
};

export default function ContactPage() {
  return (
    <main>
      <SiteHeader />
      <section className="page-shell content-page">
        <p>Contact</p>
        <h1>Get help with FindYourCrib</h1>
        <div className="content-grid">
          <article>
            <Mail size={22} />
            <h2>General support</h2>
            <p>Email support for renter, agent, listing, and account questions.</p>
            <a href="mailto:support@findyourcrib.com">support@findyourcrib.com</a>
          </article>
          <article>
            <ShieldCheck size={22} />
            <h2>Trust and moderation</h2>
            <p>Report suspicious listings, inaccurate availability, or agent conduct issues.</p>
            <a href="mailto:trust@findyourcrib.com">trust@findyourcrib.com</a>
          </article>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
