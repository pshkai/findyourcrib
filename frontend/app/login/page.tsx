"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
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
      const data = await loginUser(formData);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Login failed");
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
            Welcome Back
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Login to FYC
          </h1>

          <p className="mt-3 text-gray-600">
            Access your account to manage inquiries and property listings.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-black">
              Register
            </Link>
          </p>
        </div>
      </Container>
    </main>
  );
}