"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createInquiry } from "@/lib/api";

interface InquiryFormProps {
  propertyId: string;
}

export default function InquiryForm({ propertyId }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await createInquiry(propertyId, formData);

      setSuccessMessage("Inquiry sent successfully.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
  if (error instanceof Error) {
    setErrorMessage(error.message);
  } else {
    setErrorMessage("Failed to send inquiry. Please try again.");
  }
} finally {
  setIsLoading(false);
}
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input
        name="name"
        type="text"
        placeholder="Your name"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
      />

      <input
        name="email"
        type="email"
        placeholder="Your email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
      />

      <input
        name="phone"
        type="text"
        placeholder="Phone number"
        value={formData.phone}
        onChange={handleChange}
        required
        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none"
      />

      <textarea
        name="message"
        placeholder="Message"
        value={formData.message}
        onChange={handleChange}
        required
        rows={4}
        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none"
      />

      {successMessage && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-2xl bg-black text-white hover:bg-gray-800"
        size="lg"
      >
        {isLoading ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  );
}