import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="topbar">
      <div className="page-shell nav">
        <a className="brand" href="/">
          <span>FYC</span>
          <strong>FindYourCrib</strong>
        </a>
        <nav aria-label="Main navigation">
          <a href="/properties">Browse</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/login">Login</a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
