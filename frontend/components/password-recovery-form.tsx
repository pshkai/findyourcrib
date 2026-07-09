"use client";

import { useState } from "react";
import { ArrowRight, Home, KeyRound, Mail } from "lucide-react";
import { forgotPassword, resetPassword } from "../lib/auth-client";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setSubmitting(true);

    try {
      const response = await forgotPassword({ email: String(formData.get("email") ?? "") });
      setResetToken(response.meta?.resetToken ?? null);
      setSent(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to request password reset");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" action={onSubmit}>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>

      {sent ? (
        <p className="auth-success">
          If that email exists, a reset link is ready. {resetToken ? <a href={`/reset-password?token=${resetToken}`}>Open local reset link</a> : null}
        </p>
      ) : null}
      {error ? <p className="auth-error">{error}</p> : null}

      <button type="submit" disabled={isSubmitting}>
        <Mail size={18} />
        {isSubmitting ? "Sending..." : "Send reset link"}
      </button>

      <a className="auth-home" href="/login">
        <ArrowRight size={16} />
        Back to login
      </a>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setComplete] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setSubmitting(true);

    try {
      await resetPassword({
        token,
        password: String(formData.get("password") ?? "")
      });
      setComplete(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to reset password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" action={onSubmit}>
      <label>
        New password
        <input name="password" type="password" autoComplete="new-password" required minLength={8} />
      </label>

      {isComplete ? (
        <p className="auth-success">
          Your password has been reset. <a href="/login">Login with the new password</a>
        </p>
      ) : null}
      {error ? <p className="auth-error">{error}</p> : null}

      <button type="submit" disabled={isSubmitting || isComplete || !token}>
        <KeyRound size={18} />
        {isSubmitting ? "Resetting..." : "Reset password"}
      </button>

      <a className="auth-home" href="/">
        <Home size={16} />
        Back to search
      </a>
    </form>
  );
}
