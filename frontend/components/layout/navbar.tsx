"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Container from "@/components/ui/Container";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-lg">

      <Container>
        <nav className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight">
            FYC
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">

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
              href="/about"
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              Contact
            </Link>

            <button className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800">
              List Property
            </button>
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
      </Container>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">

          <Container>
            <div className="flex flex-col gap-5 py-6">

              <Link href="/" className="text-sm font-medium text-gray-700">
                Home
              </Link>

              <Link
                href="/properties"
                className="text-sm font-medium text-gray-700"
              >
                Properties
              </Link>

              <Link
                href="/about"
                className="text-sm font-medium text-gray-700"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="text-sm font-medium text-gray-700"
              >
                Contact
              </Link>

              <button className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white">
                List Property
              </button>

            </div>
          </Container>
        </div>
      )}
    </header>
  );
}