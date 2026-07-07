import { SlidersHorizontal, Search } from "lucide-react";
import { PropertyCard } from "../components/property-card";
import { getFeaturedProperties } from "../lib/api";
import "./page.css";

export default async function Home() {
  const properties = await getFeaturedProperties();

  return (
    <main>
      <header className="topbar">
        <div className="page-shell nav">
          <strong>FindYourCrib</strong>
          <nav aria-label="Main navigation">
            <a href="/properties">Browse</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/login">Login</a>
          </nav>
        </div>
      </header>

      <section className="search-band">
        <div className="page-shell search-layout">
          <div className="search-copy">
            <h1>Find verified rental homes in Thailand</h1>
            <p>Search condos, apartments, houses, and villas with cleaner listings, real availability, and agent accountability.</p>
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
