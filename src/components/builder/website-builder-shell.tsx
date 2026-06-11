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
    /*
      100dvh = dynamic viewport height.
      On mobile, 100vh includes the browser chrome (address bar) so content
      gets clipped underneath it. 100dvh is only the VISIBLE area.
    */
    <div
      className="flex flex-col overflow-hidden bg-[var(--color-background)]"
      style={{ height: "100dvh" }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 grid h-[var(--header-height)] shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-[var(--color-border)] bg-white/95 px-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:px-4">
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

        <div className="flex min-w-0 items-center justify-center gap-2">
          <button className="hidden min-w-0 items-center gap-1.5 rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white px-2.5 py-1 text-[12px] font-semibold text-[var(--color-text)] transition-colors hover:bg-gray-50 sm:flex">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[var(--color-primary)] text-[8px] font-bold text-white">
              RM
            </span>
            <span className="hidden truncate xl:inline">Royal Moments Events</span>
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

        <div className="flex min-w-0 items-center justify-end gap-2 overflow-x-auto">
          <Button variant="outline" size="sm" className="h-7 shrink-0 gap-1.5 px-2 text-[12px] font-medium sm:px-2.5">
            <Save className="h-3 w-3" />
            <span className="hidden lg:inline">Save Draft</span>
          </Button>
          <Button variant="outline" size="sm" className="h-7 shrink-0 gap-1.5 border-[var(--color-primary)]/30 px-2 text-[12px] font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 sm:px-2.5">
            <Eye className="h-3 w-3" />
            <span className="hidden lg:inline">Preview Website</span>
          </Button>
          <Button size="sm" className="h-7 shrink-0 gap-1.5 bg-[var(--color-primary)] px-2 text-[12px] font-semibold hover:bg-[var(--color-primary)]/90 sm:px-3">
            <Globe className="h-3 w-3" />
            <span className="hidden lg:inline">Publish Website</span>
          </Button>
          <div className="hidden h-6 w-px shrink-0 bg-[var(--color-border)] sm:block" />
          <div ref={menuRef} className="relative shrink-0">
            <button
            type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-1.5 rounded-[var(--radius-button)] px-1 py-1 transition-colors hover:bg-gray-50 sm:px-1.5"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-[9px] font-bold text-white">
                RK
              </div>
              <ChevronDown className="hidden h-3 w-3 text-[var(--color-text-secondary)] sm:block" />
            </button>
            {menuOpen && (
<div className="fixed right-3 z-50 mt-1 w-48 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white py-1 shadow-lg"
    style={{ top: "var(--header-height)" }}
  >                <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[var(--color-text)] transition-colors hover:bg-gray-50">
                  <User className="h-4 w-4 text-[var(--color-text-secondary)]" />
                  Profile
                </Link>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[var(--color-danger)] transition-colors hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Body row ───────────────────────────────────────────────────── */}
      {/*
        min-h-0 is the critical fix for scroll on mobile.
        Flex children default to min-height: auto, which means this row
        tries to be as tall as its content — blowing past the viewport.
        min-h-0 lets it shrink to fit the remaining dvh space so overflow
        actually clips and the scroll container inside works correctly.
      */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar pathname={pathname} collapsed={collapsed} />

        {/*
          This <main> is the ONE true scroll container for page content.
          - overflow-y-auto: enables vertical scrolling here (and only here)
          - overflow-x-hidden: prevents horizontal bleed
          - min-w-0: prevents the flex child from overflowing past the sidebar
          - flex-1: fills remaining width
          Do NOT add overflow-hidden on children — that would re-block scroll.
        */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}