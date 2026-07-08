"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { Building2, Heart, Inbox, LayoutDashboard, LoaderCircle, LockKeyhole, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";
import { SiteHeader } from "./site-header";

type DashboardSection = "overview" | "listings" | "inquiries" | "favorites" | "new-listing";

const navItems = [
  { section: "overview", label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { section: "listings", label: "Listings", href: "/dashboard/listings", icon: Building2 },
  { section: "inquiries", label: "Inquiries", href: "/dashboard/inquiries", icon: Inbox },
  { section: "favorites", label: "Favorites", href: "/dashboard/favorites", icon: Heart }
] satisfies Array<{
  section: DashboardSection;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}>;

interface DashboardShellProps {
  active: DashboardSection;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function DashboardShell({ active, eyebrow = "Workspace", title, description, children }: DashboardShellProps) {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "guest") {
      router.replace("/login");
    }
  }, [router, status]);

  if (status === "loading") {
    return (
      <>
        <SiteHeader />
        <main className="dashboard-shell">
          <section className="page-shell dashboard-auth-state">
            <LoaderCircle className="spin" size={24} />
            Checking your session...
          </section>
        </main>
      </>
    );
  }

  if (status === "guest") {
    return (
      <>
        <SiteHeader />
        <main className="dashboard-shell">
          <section className="page-shell dashboard-auth-state">
            <LockKeyhole size={24} />
            Login to open your FindYourCrib workspace.
            <a href="/login">Login</a>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="dashboard-shell">
        <section className="page-shell dashboard-frame">
          <aside className="dashboard-sidebar" aria-label="Dashboard navigation">
            <div>
              <p>Agent tools</p>
              <h2>Control room</h2>
            </div>
            <nav>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.section === active;

                return (
                  <a aria-current={isActive ? "page" : undefined} className={isActive ? "active" : undefined} href={item.href} key={item.href}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
            <a className="dashboard-create-link" href="/dashboard/listings/new">
              <PlusCircle size={18} />
              New listing
            </a>
          </aside>
          <section className="dashboard-content">
            <div className="dashboard-kicker">
              <div>
                <p>{eyebrow}</p>
                <h1>{title}</h1>
                {description ? <span>{description}</span> : null}
              </div>
            </div>
            {children}
          </section>
        </section>
      </main>
    </>
  );
}
