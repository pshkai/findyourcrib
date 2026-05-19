"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await loginUser({
        email,
        password,
      });

      localStorage.setItem("token", data.access_token || data.token);

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Login failed.");
      }
    } finally {
      setIsLoading(false);
    }
  }

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

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
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
            {isLoading ? "Logging in..." : "Login"}
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