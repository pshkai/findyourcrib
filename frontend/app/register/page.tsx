"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "AGENT">("CUSTOMER");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage("");

      await registerUser({
        name,
        email,
        password,
        role,
      });

      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Registration failed.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-[2rem] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          Create Account
        </p>

        <h1 className="mt-3 text-4xl font-bold text-gray-900">
          Join FYC
        </h1>

        <p className="mt-3 text-gray-600">
          Create an account to browse, inquire, or list properties.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="rounded-2xl border border-gray-200 px-4 py-4 text-gray-900 outline-none"
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="rounded-2xl border border-gray-200 px-4 py-4 text-gray-900 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="rounded-2xl border border-gray-200 px-4 py-4 text-gray-900 outline-none"
          />

          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value as "CUSTOMER" | "AGENT")
            }
            className="rounded-2xl border border-gray-200 px-4 py-4 text-gray-900 outline-none"
          >
            <option value="CUSTOMER">Customer</option>
            <option value="AGENT">Agent</option>
          </select>

          {errorMessage && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-full bg-black px-7 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-gray-900">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}