"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import "./page.css";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="system-state-page">
      <section className="system-state-panel">
        <span>
          <AlertTriangle size={18} />
          Something slipped
        </span>
        <h1>We could not load this view.</h1>
        <p>The page hit an unexpected problem. Try again, or head back to search.</p>
        <div className="system-state-actions">
          <button type="button" onClick={reset}>
            <RotateCw size={17} />
            Try again
          </button>
          <a href="/">Back to search</a>
        </div>
      </section>
    </main>
  );
}
