import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900">FYC</h2>

          <p className="mt-4 max-w-md text-gray-600">
            Find verified rental homes, condos, apartments, and villas across
            Thailand.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">Explore</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
            <Link href="/">Home</Link>
            <Link href="/properties">Properties</Link>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">Popular Areas</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-gray-600">
            <span>Bangkok</span>
            <span>Chiang Mai</span>
            <span>Phuket</span>
            <span>Pattaya</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-gray-200 pt-6 text-sm text-gray-500">
        © 2026 FYC. All rights reserved.
      </div>
    </footer>
  );
}