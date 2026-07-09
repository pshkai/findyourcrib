import "./page.css";

export default function LoadingPage() {
  return (
    <main className="system-state-page">
      <section className="system-state-panel loading-panel" aria-live="polite">
        <div className="loading-mark" aria-hidden="true">
          <span />
        </div>
        <span>Finding the right view</span>
        <h1>Loading FindYourCrib</h1>
        <p>Preparing verified homes, filters, and account tools.</p>
      </section>
    </main>
  );
}
