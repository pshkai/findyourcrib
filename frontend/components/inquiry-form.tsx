"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { createInquiry } from "../lib/inquiry-client";

export function InquiryForm({ propertyId }: { propertyId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  async function onSubmit(formData: FormData) {
    setError(null);
    setSubmitting(true);

    try {
      await createInquiry({
        propertyId,
        contactName: String(formData.get("contactName") ?? ""),
        contactEmail: String(formData.get("contactEmail") ?? ""),
        contactPhone: String(formData.get("contactPhone") ?? "") || undefined,
        message: String(formData.get("message") ?? "")
      });
      setSent(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to send inquiry");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return <div className="inquiry-success">Inquiry sent. The agent can now follow up with you.</div>;
  }

  return (
    <form className="inquiry-form" action={onSubmit}>
      <label>
        Name
        <input name="contactName" required />
      </label>
      <label>
        Email
        <input name="contactEmail" type="email" required />
      </label>
      <label>
        Phone
        <input name="contactPhone" />
      </label>
      <label>
        Message
        <textarea name="message" required minLength={10} defaultValue="Hi, I would like to know if this property is still available." />
      </label>
      {error ? <p className="auth-error">{error}</p> : null}
      <button type="submit" disabled={isSubmitting}>
        <Send size={18} />
        {isSubmitting ? "Sending..." : "Send inquiry"}
      </button>
    </form>
  );
}
