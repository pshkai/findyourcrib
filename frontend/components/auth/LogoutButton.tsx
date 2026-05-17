"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="lg"
      className="rounded-xl"
    >
      Logout
    </Button>
  );
}