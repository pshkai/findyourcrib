import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              FYC
            </h2>

            <p className="mt-4 text-gray-600">
              Find your perfect property with verified
              listings and modern search experience.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-4">

              <a
                href="#"
                className="rounded-full border border-gray-200 p-3 transition hover:bg-gray-100"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="#"
                className="rounded-full border border-gray-200 p-3 transition hover:bg-gray-100"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="#"
                className="rounded-full border border-gray-200 p-3 transition hover:bg-gray-100"
              >
                <FaTwitter size={18} />
              </a>

              <a
                href="#"
                className="rounded-full border border-gray-200 p-3 transition hover:bg-gray-100"
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900">
              Company
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                href="/"
                className="text-gray-600 transition hover:text-black"
              >
                Home
              </Link>

              <Link
                href="/properties"
                className="text-gray-600 transition hover:text-black"
              >
                Properties
              </Link>

              <Link
                href="/about"
                className="text-gray-600 transition hover:text-black"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="text-gray-600 transition hover:text-black"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900">
              Support
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                href="#"
                className="text-gray-600 transition hover:text-black"
              >
                Help Center
              </Link>

              <Link
                href="#"
                className="text-gray-600 transition hover:text-black"
              >
                Terms of Service
              </Link>

              <Link
                href="#"
                className="text-gray-600 transition hover:text-black"
              >
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-900">
              Newsletter
            </h3>

            <p className="mt-5 text-gray-600">
              Get updates about new properties and offers.
            </p>

            <div className="mt-5 flex flex-col gap-3">

              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-2xl border border-gray-200 px-4 py-3 outline-none"
              />

              <button className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          © 2026 FYC. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}