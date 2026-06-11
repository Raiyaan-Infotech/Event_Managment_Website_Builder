"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Eye,
  Globe,
  LogOut,
  Monitor,
  PanelLeft,
  Save,
  Smartphone,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";

export function WebsiteBuilderShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCollapsed(localStorage.getItem("wb-sidebar-collapsed") === "1");
  }, []);

  function toggleSidebar() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("wb-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--color-background)]">
      {/* ── Top header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 grid h-[var(--header-height)] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-[var(--color-border)] bg-white/95 px-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:px-4">
        {/* Left: toggle + branding */}
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-[var(--color-text)]"
          >
            <PanelLeft className="h-3.5 w-3.5" />
          </button>
          <div className="flex min-w-0 items-center gap-1.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--color-primary)] text-white">
              <Globe className="h-3.5 w-3.5" />
            </div>
            <div className="hidden min-w-0 leading-none lg:block">
              <p className="truncate text-[12px] font-bold text-[var(--color-text)]">
                Website Builder
              </p>
              <p className="mt-0.5 truncate text-[10px] text-[var(--color-text-secondary)]">
                Build and manage your website
              </p>
            </div>
          </div>
        </div>

        {/* Center: vendor name + device switcher */}
        <div className="flex min-w-0 items-center justify-center gap-2">
          <button className="hidden min-w-0 items-center gap-1.5 rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white px-2.5 py-1 text-[12px] font-semibold text-[var(--color-text)] transition-colors hover:bg-gray-50 sm:flex">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[var(--color-primary)] text-[8px] font-bold text-white">
              RM
            </span>
            <span className="hidden truncate xl:inline">
              Royal Moments Events
            </span>
          </button>
          <div className="flex shrink-0 items-center rounded-[var(--radius-button)] border border-[var(--color-border)] bg-gray-50 p-0.5">
            <button
              onClick={() => setDevice("desktop")}
              aria-label="Desktop preview"
              className={cn(
                "flex h-6 w-7 items-center justify-center rounded-md transition-colors",
                device === "desktop"
                  ? "bg-white text-[var(--color-primary)] shadow-sm"
                  : "text-gray-400 hover:text-gray-600",
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setDevice("mobile")}
              aria-label="Mobile preview"
              className={cn(
                "flex h-6 w-7 items-center justify-center rounded-md transition-colors",
                device === "mobile"
                  ? "bg-white text-[var(--color-primary)] shadow-sm"
                  : "text-gray-400 hover:text-gray-600",
              )}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right: actions + user menu */}
        <div className="flex min-w-0 items-center justify-end gap-2 overflow-x-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-7 shrink-0 gap-1.5 px-2 text-[12px] font-medium sm:px-2.5"
          >
            <Save className="h-3 w-3" />
            <span className="hidden lg:inline">Save Draft</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 shrink-0 gap-1.5 border-[var(--color-primary)]/30 px-2 text-[12px] font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 sm:px-2.5"
          >
            <Eye className="h-3 w-3" />
            <span className="hidden lg:inline">Preview Website</span>
          </Button>
          <Button
            size="sm"
            className="h-7 shrink-0 gap-1.5 bg-[var(--color-primary)] px-2 text-[12px] font-semibold hover:bg-[var(--color-primary)]/90 sm:px-3"
          >
            <Globe className="h-3 w-3" />
            <span className="hidden lg:inline">Publish Website</span>
          </Button>

          <div className="hidden h-6 w-px shrink-0 bg-[var(--color-border)] sm:block" />

          <div ref={menuRef} className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 rounded-[var(--radius-button)] px-1 py-1 transition-colors hover:bg-gray-50 sm:px-1.5"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-[9px] font-bold text-white">
                RK
              </div>
              <ChevronDown className="hidden h-3 w-3 text-[var(--color-text-secondary)] sm:block" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white py-1 shadow-lg">
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[var(--color-text)] transition-colors hover:bg-gray-50"
                >
                  <User className="h-4 w-4 text-[var(--color-text-secondary)]" />
                  Profile
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[var(--color-danger)] transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Body: sidebar + main ────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/*
          Sidebar sits in normal flex flow.
          Its own width (collapsed: 48px, expanded: 180px) is declared inside
          the Sidebar component — we just make sure it never shrinks.
        */}
        <Sidebar pathname={pathname} collapsed={collapsed} />

        {/*
          main gets flex-1 so it fills the remaining space automatically.
          NO ml-* here — flex already positions main right after the sidebar.
          The transition on the sidebar width (inside <Sidebar>) is enough
          to animate the content area resizing.
        */}
        <main className="min-w-0 flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}