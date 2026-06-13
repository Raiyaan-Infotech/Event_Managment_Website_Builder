"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Eye,
  Globe,
  LogOut,
  Monitor,
  MoreVertical,
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
  const showWebsiteActions = pathname.startsWith("/website");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const actionsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(e.target as Node))
        setActionsMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCollapsed(localStorage.getItem("wb-sidebar-collapsed") === "1");
  }, []);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  function toggleSidebar() {
    if (window.matchMedia("(max-width: 639px)").matches) {
      setMobileSidebarOpen((prev) => !prev);
      return;
    }
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("wb-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  }

  return (
    <div
      className="flex flex-col overflow-hidden bg-[var(--color-background)]"
      style={{ height: "100dvh" }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 grid h-[var(--header-height)] shrink-0 grid-cols-[auto_auto] items-center justify-between gap-1.5 border-b border-[var(--color-border)] bg-white/95 px-2 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-3 sm:px-4">

        {/* Left: sidebar toggle + logo */}
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={mobileSidebarOpen || !collapsed ? "Close navigation" : "Open navigation"}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-[var(--color-text)]"
          >
            <PanelLeft className="h-3.5 w-3.5" />
          </button>
          <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--color-primary)] text-white">
              <Globe className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 leading-none">
              <p className="truncate text-[12px] font-bold text-[var(--color-text)]">
                Website Builder
              </p>
              <p className="mt-0.5 truncate text-[10px] text-[var(--color-text-secondary)]">
                Build and manage your website
              </p>
            </div>
          </div>
        </div>

        {/* Center: workspace switcher + device toggle (desktop only) */}
        <div className="hidden min-w-0 items-center justify-center gap-1 sm:flex sm:gap-2">
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

        {/* Right: action buttons + user menu */}
        <div className="flex min-w-max items-center justify-end gap-1 overflow-visible sm:min-w-0 sm:gap-2 sm:overflow-x-auto">

          {/* Desktop action buttons */}
          {showWebsiteActions ? (
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 shrink-0 gap-1.5 px-2 text-[12px] font-medium sm:px-2.5"
              >
                <Save className="h-3 w-3" />
                <span>Save Draft</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 shrink-0 gap-1.5 border-[var(--color-primary)]/30 px-2 text-[12px] font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 sm:px-2.5"
              >
                <Eye className="h-3 w-3" />
                <span>Preview Website</span>
              </Button>
              <Button
                size="sm"
                className="h-7 shrink-0 gap-1.5 bg-[var(--color-primary)] px-2 text-[12px] font-semibold hover:bg-[var(--color-primary)]/90 sm:px-3"
              >
                <Globe className="h-3 w-3" />
                <span>Publish Website</span>
              </Button>
              <div className="h-6 w-px shrink-0 bg-[var(--color-border)]" />
            </div>
          ) : null}

          {/* Mobile device toggle (icon only) */}
          <div className="flex shrink-0 items-center rounded-[var(--radius-button)] border border-[var(--color-border)] bg-gray-50 p-0.5 sm:hidden">
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

          {/* Mobile 3-dot actions menu */}
          {showWebsiteActions ? (
            <div ref={actionsMenuRef} className="relative shrink-0 sm:hidden">
              <button
                type="button"
                onClick={() => setActionsMenuOpen((prev) => !prev)}
                aria-label="More actions"
                className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-[var(--color-text)]"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {actionsMenuOpen && (
                <div
                  className="fixed right-3 z-50 mt-1 w-52 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white py-1 shadow-lg"
                  style={{ top: "var(--header-height)" }}
                >
                  <button
                    onClick={() => setActionsMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[var(--color-text)] transition-colors hover:bg-gray-50"
                  >
                    <Save className="h-4 w-4 text-[var(--color-text-secondary)]" />
                    Save Draft
                  </button>
                  <button
                    onClick={() => setActionsMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[var(--color-text)] transition-colors hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4 text-[var(--color-text-secondary)]" />
                    Preview Website
                  </button>
                  <button
                    onClick={() => setActionsMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-[13px] font-semibold text-white transition-colors bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 mx-1 rounded-[var(--radius-button)] w-[calc(100%-8px)]"
                  >
                    <Globe className="h-4 w-4" />
                    Publish Website
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* User menu */}
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
              <div
                className="fixed right-3 z-50 mt-1 w-48 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white py-1 shadow-lg"
                style={{ top: "var(--header-height)" }}
              >
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

      {/* ── Body row ───────────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileSidebarOpen(false)}
          className={cn(
            "fixed inset-x-0 bottom-0 z-20 bg-transparent sm:hidden",
            "top-[var(--header-height)]",
            mobileSidebarOpen ? "block" : "hidden",
          )}
        />
        <Sidebar
          pathname={pathname}
          collapsed={collapsed}
          mobileOpen={mobileSidebarOpen}
          mobileActionsVisible={showWebsiteActions}
          onNavigate={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}