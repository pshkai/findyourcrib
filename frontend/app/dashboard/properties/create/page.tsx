import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function CreatePropertyPage() {
  return (
    <DashboardLayout>
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          Dashboard
        </p>

        <h1 className="mt-3 text-5xl font-bold text-gray-900">
          Create Property
        </h1>

        <p className="mt-4 text-gray-600">
          Add a new rental listing to FYC.
        </p>
      </div>

      <div className="max-w-4xl rounded-[2rem] bg-white p-8 shadow-sm">
        <form className="grid gap-5">
          <input
            type="text"
            placeholder="Property title"
            className="rounded-2xl border border-gray-200 px-4 py-4 outline-none"
          />

          <textarea
            placeholder="Property description"
            rows={5}
            className="resize-none rounded-2xl border border-gray-200 px-4 py-4 outline-none"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <input
              type="number"
              placeholder="Monthly price in THB"
              className="rounded-2xl border border-gray-200 px-4 py-4 outline-none"
            />

            <select className="rounded-2xl border border-gray-200 px-4 py-4 outline-none">
              <option>Property Type</option>
              <option>CONDO</option>
              <option>APARTMENT</option>
              <option>VILLA</option>
              <option>HOUSE</option>
            </select>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <input
              type="number"
              placeholder="Bedrooms"
              className="rounded-2xl border border-gray-200 px-4 py-4 outline-none"
            />

            <input
              type="number"
              placeholder="Bathrooms"
              className="rounded-2xl border border-gray-200 px-4 py-4 outline-none"
            />

            <input
              type="number"
              placeholder="Size sqm"
              className="rounded-2xl border border-gray-200 px-4 py-4 outline-none"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <input
              type="text"
              placeholder="City / Township"
              className="rounded-2xl border border-gray-200 px-4 py-4 outline-none"
            />

            <input
              type="text"
              placeholder="Address"
              className="rounded-2xl border border-gray-200 px-4 py-4 outline-none"
            />
          </div>

          <button
            type="button"
            className="mt-4 rounded-full bg-black px-7 py-4 font-semibold text-white transition hover:bg-gray-800"
          >
            Create Property
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}