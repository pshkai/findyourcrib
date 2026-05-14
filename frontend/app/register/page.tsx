"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER" as "CUSTOMER" | "AGENT",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");

    try {
      await registerUser(formData);
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="bg-gray-50 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
            Create Account
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Register for FYC
          </h1>

          <p className="mt-3 text-gray-600">
            Join as a customer or agent to start using Find Your Crib.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <input
              name="name"
              type="text"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
            />

            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="AGENT">Agent</option>
            </select>

            {errorMessage && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="w-full rounded-2xl bg-black text-white hover:bg-gray-800"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-black">
              Login
            </Link>
          </p>
        </div>
      </Container>
    </main>
  );
}