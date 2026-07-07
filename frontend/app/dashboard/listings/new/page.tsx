import { ListingForm } from "../../../../components/listing-form";
import "../../../page.css";

export default function NewListingPage() {
  return (
    <main className="page-shell dashboard-page">
      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <p>Agent listing</p>
            <h1>Create a listing</h1>
          </div>
          <a href="/dashboard/listings">My listings</a>
        </div>
        <ListingForm />
      </section>
    </main>
  );
}
