"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearAccessToken, getCurrentUser, logoutRequest, type AuthUser } from "../lib/auth-client";

type AuthStatus = "loading" | "authenticated" | "guest";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  async function refreshUser() {
    setStatus("loading");

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setStatus(currentUser ? "authenticated" : "guest");
    } catch {
      clearAccessToken();
      setUser(null);
      setStatus("guest");
    }
  }

  function logout() {
    void logoutRequest();
    clearAccessToken();
    setUser(null);
    setStatus("guest");
  }

  useEffect(() => {
    void refreshUser();
  }, []);

  const value = useMemo(() => ({ status, user, refreshUser, logout }), [status, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
