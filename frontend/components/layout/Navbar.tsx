import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900">
          FYC
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-black">
            Home
          </Link>

          <Link href="/properties" className="text-sm font-medium text-gray-700 hover:text-black">
            Properties
          </Link>

          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black">
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}