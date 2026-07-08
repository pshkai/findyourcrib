"use client";

import { LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const router = useRouter();
  const { logout, status, user } = useAuth();

  function onLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="topbar">
      <div className="page-shell nav">
        <a className="brand" href="/">
          <span>FYC</span>
          <strong>FindYourCrib</strong>
        </a>
        <nav aria-label="Main navigation">
          <a href="/properties">Browse</a>
          {status === "authenticated" ? (
            <>
              <a href="/dashboard">Dashboard</a>
              <span className="nav-user">
                <UserRound size={16} />
                {user?.name ?? "Account"}
              </span>
              <button className="nav-logout" type="button" onClick={onLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
