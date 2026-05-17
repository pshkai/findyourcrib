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

      <div className="max-w-5xl rounded-[2rem] bg-white p-8 shadow-sm">
        <form className="grid gap-8">
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Property Title
            </label>

            <input
              type="text"
              placeholder="Modern condo near BTS"
              className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Description
            </label>

            <textarea
              placeholder="Describe the property..."
              rows={6}
              className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-4 outline-none"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Monthly Price
              </label>

              <input
                type="number"
                placeholder="25000"
                className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Property Type
              </label>

              <select className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none">
                <option>CONDO</option>
                <option>APARTMENT</option>
                <option>VILLA</option>
                <option>HOUSE</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Bedrooms
              </label>

              <input
                type="number"
                placeholder="2"
                className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Bathrooms
              </label>

              <input
                type="number"
                placeholder="2"
                className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Size (sqm)
              </label>

              <input
                type="number"
                placeholder="65"
                className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Township / City
              </label>

              <input
                type="text"
                placeholder="Bangkok"
                className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Full Address
              </label>

              <input
                type="text"
                placeholder="สุขุมวิท 24"
                className="w-full rounded-2xl border border-gray-200 px-4 py-4 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Upload Images
            </label>

            <div className="rounded-[2rem] border-2 border-dashed border-gray-300 p-10 text-center">
              <p className="text-gray-500">
                Image upload integration coming soon
              </p>
            </div>
          </div>

          <button
            type="button"
            className="w-fit rounded-full bg-black px-8 py-4 font-semibold text-white transition hover:bg-gray-800"
          >
            Create Property
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}