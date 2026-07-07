"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Home, LogIn, UserPlus } from "lucide-react";
import { login, register } from "../lib/auth-client";

type AuthMode = "login" | "register";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login({
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? "")
        });
      } else {
        await register({
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
          phoneNumber: String(formData.get("phoneNumber") ?? "") || undefined,
          role: String(formData.get("role") ?? "RENTER") as "RENTER" | "AGENT" | "OWNER"
        });
      }

      router.push("/dashboard");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" action={onSubmit}>
      {mode === "register" ? (
        <>
          <label>
            Name
            <input name="name" autoComplete="name" required />
          </label>
          <label>
            Phone
            <input name="phoneNumber" autoComplete="tel" />
          </label>
          <label>
            Account type
            <select name="role" defaultValue="RENTER">
              <option value="RENTER">Renter</option>
              <option value="AGENT">Agent</option>
              <option value="OWNER">Owner</option>
            </select>
          </label>
        </>
      ) : null}

      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Password
        <input name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={8} />
      </label>

      {error ? <p className="auth-error">{error}</p> : null}

      <button type="submit" disabled={isSubmitting}>
        {mode === "login" ? <LogIn size={18} /> : <UserPlus size={18} />}
        {isSubmitting ? "Working..." : mode === "login" ? "Login" : "Create account"}
      </button>

      <a className="auth-home" href="/">
        <Home size={16} />
        Back to search
      </a>
    </form>
  );
}
