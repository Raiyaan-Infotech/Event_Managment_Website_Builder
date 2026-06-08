"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Eye, Globe, LogOut, Monitor, PanelLeft, Save, Smartphone, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";

export function WebsiteBuilderShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
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

  const mainML = collapsed ? "ml-[60px]" : "ml-[200px]";

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)]">
      <header className="sticky top-0 z-30 flex h-[var(--header-height)] items-center justify-between border-b border-[var(--color-border)] bg-white px-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--color-border)] bg-white text-gray-500 hover:bg-gray-100 hover:text-[var(--color-text)] transition-colors"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
              <Globe className="h-4 w-4" />
            </div>
            <div className="leading-none">
              <p className="text-[13px] font-bold tracking-[-0.01em] text-[var(--color-text)]">Website Builder</p>
              <p className="text-[11px] text-[var(--color-text-secondary)]">Build and manage your website</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-3 py-1.5 text-[13px] font-semibold text-[var(--color-text)] hover:bg-gray-50">
            <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-[var(--color-primary)] text-[9px] font-bold text-white">RM</span>
            Royal Moments Events
            <ChevronDown className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
          </button>
          <div className="flex items-center rounded-lg border border-[var(--color-border)] bg-gray-50 p-0.5">
            <button
              onClick={() => setDevice("desktop")}
              className={cn(
                "flex h-7 w-8 items-center justify-center rounded-md transition-colors",
                device === "desktop" ? "bg-white shadow-sm text-[var(--color-primary)]" : "text-gray-400 hover:text-gray-600",
              )}
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={cn(
                "flex h-7 w-8 items-center justify-center rounded-md transition-colors",
                device === "mobile" ? "bg-white shadow-sm text-[var(--color-primary)]" : "text-gray-400 hover:text-gray-600",
              )}
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3 text-[13px] font-medium">
            <Save className="h-3.5 w-3.5" />
            Save Draft
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3 text-[13px] font-medium text-[var(--color-primary)] border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/5">
            <Eye className="h-3.5 w-3.5" />
            Preview Website
          </Button>
          <Button size="sm" className="h-8 gap-1.5 bg-[var(--color-primary)] px-4 text-[13px] font-semibold hover:bg-[var(--color-primary)]/90">
            <Globe className="h-3.5 w-3.5" />
            Publish Website
          </Button>

          <div className="h-6 w-px bg-[var(--color-border)]" />

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
                RK
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white shadow-lg py-1 z-50">
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[var(--color-text)] hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4 text-[var(--color-text-secondary)]" />
                  Profile
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-[var(--color-danger)] hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar pathname={pathname} collapsed={collapsed} />
        <main className={cn("flex-1 p-[var(--content-padding)] transition-[margin-left] duration-200 ease-in-out", mainML)}>
          {children}
        </main>
      </div>
    </div>
  );
}
