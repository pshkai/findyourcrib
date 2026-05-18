"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-gray-900"
        >
          FYC
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Home
          </Link>

          <Link
            href="/properties"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Properties
          </Link>

          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Dashboard
          </Link>

          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 transition hover:text-black"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Register
          </Link>
        </nav>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 md:hidden"
        >
          ☰
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="flex flex-col gap-2 p-4">
            <Link
              href="/"
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Home
            </Link>

            <Link
              href="/properties"
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Properties
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <Link
              href="/login"
              className="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-black px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}