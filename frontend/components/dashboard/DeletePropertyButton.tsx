"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { deleteProperty } from "@/lib/api";

interface DeletePropertyButtonProps {
  propertyId: number;
  onDeleteSuccess?: () => void;
}

export default function DeletePropertyButton({
  propertyId,
  onDeleteSuccess,
}: DeletePropertyButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      setIsDeleting(true);

      await deleteProperty(token, propertyId);

      alert("Property deleted successfully.");

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete property.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-60"
    >
      <Trash2 size={16} />
      {isDeleting ? "Deleting..." : "Delete Property"}
    </button>
  );
}