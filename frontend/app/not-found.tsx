import { Compass } from "lucide-react";
import "./page.css";

export default function NotFoundPage() {
  return (
    <main className="system-state-page">
      <section className="system-state-panel">
        <span>
          <Compass size={18} />
          No match
        </span>
        <h1>This page is not listed.</h1>
        <p>The home may have moved, expired, or never existed.</p>
        <div className="system-state-actions">
          <a href="/properties">Browse homes</a>
          <a href="/">Back to search</a>
        </div>
      </section>
    </main>
  );
}
