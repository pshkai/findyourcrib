import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          Welcome Back
        </p>

        <h1 className="mt-3 text-4xl font-bold text-gray-900">
          Login to FYC
        </h1>

        <p className="mt-3 text-gray-600">
          Access your dashboard and manage your listings.
        </p>

        <form className="mt-8 grid gap-5">
          <input
            type="email"
            placeholder="Email address"
            className="rounded-2xl border border-gray-200 px-4 py-4 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            className="rounded-2xl border border-gray-200 px-4 py-4 outline-none"
          />

          <button
            type="button"
            className="rounded-full bg-black px-7 py-4 font-semibold text-white transition hover:bg-gray-800"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-gray-900">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}