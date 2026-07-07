import { Building2, MapPinned, ShieldCheck, SlidersHorizontal, Sparkles, Search } from "lucide-react";
import { PropertyCard } from "../components/property-card";
import { ThemeToggle } from "../components/theme-toggle";
import { getFeaturedProperties } from "../lib/api";
import "./page.css";

export default async function Home() {
  const properties = await getFeaturedProperties();

  return (
    <main>
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

      <section className="search-band">
        <div className="hero-grid" aria-hidden="true">
          <span className="signal signal-a">BTS</span>
          <span className="signal signal-b">Verified</span>
          <span className="signal signal-c">Rawai</span>
        </div>
        <div className="page-shell search-layout">
          <div className="search-copy">
            <p className="eyebrow">
              <Sparkles size={15} />
              Live-ready rentals, calmer search
            </p>
            <h1>Find verified rental homes in Thailand</h1>
            <p>Search condos, apartments, houses, and villas with cleaner listings, real availability, and agent accountability.</p>
            <div className="hero-proof" aria-label="Platform highlights">
              <span>
                <ShieldCheck size={17} />
                Verified agents
              </span>
              <span>
                <MapPinned size={17} />
                Neighborhood-first
              </span>
              <span>
                <Building2 size={17} />
                Real availability
              </span>
            </div>
          </div>
          <form className="search-panel" action="/properties">
            <label>
              Location
              <input name="query" placeholder="Bangkok, Phuket, Chiang Mai" />
            </label>
            <label>
              Property type
              <select name="propertyType" defaultValue="">
                <option value="">Any type</option>
                <option value="CONDO">Condo</option>
                <option value="APARTMENT">Apartment</option>
                <option value="HOUSE">House</option>
                <option value="VILLA">Villa</option>
              </select>
            </label>
            <label>
              Max price
              <input name="maxPrice" placeholder="50000" inputMode="numeric" />
            </label>
            <button type="submit">
              <Search size={18} />
              Search
            </button>
            <button className="filter-button" type="button" aria-label="More filters">
              <SlidersHorizontal size={19} />
            </button>
          </form>
        </div>
      </section>

      <section className="page-shell insight-strip" aria-label="Search approach">
        <div>
          <span>01</span>
          <p>Start with places, not portals</p>
        </div>
        <div>
          <span>02</span>
          <p>Show fewer but better homes</p>
        </div>
        <div>
          <span>03</span>
          <p>Keep every inquiry accountable</p>
        </div>
      </section>

      <section className="page-shell listings-section">
        <div className="section-heading">
          <div>
            <p>Verified listings</p>
            <h2>Fresh homes worth checking first</h2>
          </div>
          <a href="/properties">View all</a>
        </div>
        <div className="listing-grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </main>
  );
}
