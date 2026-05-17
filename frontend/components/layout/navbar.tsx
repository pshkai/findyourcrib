"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <Container>
        <nav className="flex h-20 items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            FYC
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-black">
              Home
            </Link>

            <Link href="/properties" className="text-sm font-medium text-gray-700 hover:text-black">
              Properties
            </Link>

            <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-black">
              Dashboard
            </Link>

            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black">
              Login
            </Link>

            <Button asChild size="lg" className="rounded-xl bg-black text-white hover:bg-gray-800">
              <Link href="/register">Register</Link>
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
      </Container>

      {isOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <Container>
            <div className="flex flex-col gap-5 py-6">
              <Link href="/" className="text-sm font-medium text-gray-700">
                Home
              </Link>

              <Link href="/properties" className="text-sm font-medium text-gray-700">
                Properties
              </Link>

              <Link href="/dashboard" className="text-sm font-medium text-gray-700">
                Dashboard
              </Link>

              <Link href="/login" className="text-sm font-medium text-gray-700">
                Login
              </Link>

              <Button asChild size="lg" className="rounded-xl bg-black text-white hover:bg-gray-800">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}