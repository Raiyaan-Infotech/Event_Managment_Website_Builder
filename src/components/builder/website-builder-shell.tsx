"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Eye,
  Globe,
  Monitor,
  MoreVertical,
  PanelLeft,
  Smartphone,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusLoader } from "@/components/status-pages/status-loader";
import {
  useSaveWebsiteSettings,
  useWebsiteBuilderData,
} from "@/hooks/use-website-builder";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";

/** Publish / Unpublish segmented radio for the builder header. */
function PublishToggle({
  isPublished,
  onChange,
  loading,
}: {
  isPublished: boolean;
  onChange: (publish: boolean) => void;
  loading?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Website publish status"
      className="flex shrink-0 items-center rounded-[var(--radius-button)] border border-[var(--color-border)] bg-gray-50 p-0.5"
    >
      <button
        type="button"
        role="radio"
        aria-checked={isPublished}
        disabled={loading}
        onClick={() => onChange(true)}
        className={cn(
          "flex h-6 items-center gap-1 rounded-md px-2.5 text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          isPublished
            ? "bg-[var(--color-primary)] text-white shadow-sm"
            : "text-gray-500 hover:text-gray-700",
        )}
      >
        <Globe className="h-3 w-3" />
        Published
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={!isPublished}
        disabled={loading}
        onClick={() => onChange(false)}
        className={cn(
          "flex h-6 items-center rounded-md px-2.5 text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
          !isPublished
            ? "bg-red-600 text-white shadow-sm"
            : "text-gray-500 hover:text-gray-700",
        )}
      >
        Unpublished
      </button>
    </div>
  );
}

export function WebsiteBuilderShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showWebsiteActions = pathname.startsWith("/website");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [collapsed, setCollapsed] = useState(false);
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobileWorkspace = device === "mobile";

  const { data: builderData } = useWebsiteBuilderData();
  const saveWebsiteSettings = useSaveWebsiteSettings();
  const { showToast } = useToast();
  const websiteStatus = String(
    (builderData?.website as Record<string, unknown> | undefined)?.status || "draft",
  );
  const isPublished = websiteStatus === "published";

  function setPublished(publish: boolean) {
    const nextStatus = publish ? "published" : "maintenance";
    if (nextStatus === websiteStatus || saveWebsiteSettings.isPending) return;
    setActionsMenuOpen(false);
    saveWebsiteSettings.mutate(
      { status: nextStatus },
      {
        onSuccess: () =>
          showToast(
            publish
              ? "Website published."
              : "Website unpublished — visitors will see the maintenance page.",
          ),
        onError: (error) =>
          showToast(
            error instanceof Error
              ? error.message
              : "Unable to update publish status.",
            "error",
          ),
      },
    );
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
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
    setActionsMenuOpen(false);
    if (navigationTimerRef.current) {
      clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = null;
    }
    setIsNavigating(false);
  }, [pathname, device]);

  useEffect(
    () => () => {
      if (navigationTimerRef.current) {
        clearTimeout(navigationTimerRef.current);
      }
    },
    [],
  );

  function handleCloseMobileSidebar() {
    setMobileSidebarOpen(false);
  }

  function handleNavigationStart(href: string) {
    setMobileSidebarOpen(false);
    setActionsMenuOpen(false);

    if (href !== pathname) {
      if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = setTimeout(() => {
        setIsNavigating(true);
      }, 180);
    }
  }

  function toggleSidebar() {
    if (isMobileWorkspace || window.matchMedia("(max-width: 639px)").matches) {
      setMobileSidebarOpen((prev) => !prev);
      return;
    }
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("wb-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  }

  function openWebsitePreview() {
    setActionsMenuOpen(false);
    window.open("/preview", "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className="flex flex-col overflow-hidden bg-[var(--color-background)]"
      style={{ height: "100dvh" }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex h-[var(--header-height)] shrink-0 items-center border-b border-[var(--color-border)] bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">

        {/* Sidebar header spacer — same width as sidebar, aligned flush */}
        {!isMobileWorkspace && (
          <div
            style={{ width: collapsed ? 48 : 220 }}
            className={cn(
              "flex h-full shrink-0 items-center border-r border-[var(--color-border)] transition-[width] duration-200 ease-in-out max-sm:hidden",
              collapsed ? "justify-center px-0" : "px-4",
            )}
          >
            <div className={cn("flex min-w-0 items-center", collapsed ? "justify-center" : "gap-2")}>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-button)] bg-[var(--color-primary)] text-white">
                <Globe className="h-3.5 w-3.5" />
              </div>
              {!collapsed && (
                <div className="min-w-0 leading-none">
                  <p className="truncate text-[12px] font-bold text-[var(--color-text)]">
                    Website Builder
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-[var(--color-text-secondary)]">
                    Build and manage your website
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header content */}
        <div className="flex flex-1 items-center justify-between gap-1.5 px-2 sm:gap-3 sm:px-4">

          {/* Left: mobile toggle + logo */}
          <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
            {/* Logo */}
            <div className={cn("flex min-w-0 items-center gap-1 sm:gap-1.5", !isMobileWorkspace && "sm:hidden")}>
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
          <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 sm:flex sm:gap-2">
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
          <div className="flex min-w-max items-center justify-end gap-1 sm:min-w-0 sm:gap-2">

            {/* Desktop action buttons */}
            {showWebsiteActions && !isMobileWorkspace ? (
              <div className="hidden sm:flex sm:items-center sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openWebsitePreview}
                  className="h-7 shrink-0 gap-1.5 border-[var(--color-primary)]/30 px-2 text-[12px] font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 sm:px-2.5"
                >
                  <Eye className="h-3 w-3" />
                  <span>Preview Website</span>
                </Button>
                <PublishToggle
                  isPublished={isPublished}
                  onChange={setPublished}
                  loading={saveWebsiteSettings.isPending}
                />
                <div className="h-6 w-px shrink-0 bg-[var(--color-border)]" />
              </div>
            ) : null}

            {/* Mobile device toggle */}
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
            {showWebsiteActions && !isMobileWorkspace ? (
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
                      onClick={openWebsitePreview}
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[var(--color-text)] transition-colors hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4 text-[var(--color-text-secondary)]" />
                      Preview Website
                    </button>
                    <div className="px-3 py-2.5">
                      <PublishToggle
                        isPublished={isPublished}
                        onChange={setPublished}
                        loading={saveWebsiteSettings.isPending}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <Link
              href="/dashboard"
              onClick={() => handleNavigationStart("/dashboard")}
              className="shrink-0"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 px-2.5 text-[12px] font-semibold"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Body row ───────────────────────────────────────────────────── */}
      <div
        className={cn(
          "relative flex min-h-0 flex-1 overflow-hidden",
          isMobileWorkspace && "bg-slate-100",
        )}
      >
        {/* Mobile sidebar backdrop */}
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
          collapsed={isMobileWorkspace ? true : collapsed}
          mobilePreview={isMobileWorkspace}
          mobileOpen={mobileSidebarOpen}
          mobileActionsVisible={showWebsiteActions}
          onCloseMobile={handleCloseMobileSidebar}
          onNavigate={handleNavigationStart}
        />

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle navigation panel"
          style={
            {
              "--sidebar-toggle-left": isMobileWorkspace
                ? "56px"
                : collapsed
                  ? "56px"
                  : "228px",
            } as React.CSSProperties
          }
          className="absolute left-[var(--sidebar-toggle-left)] top-1.5 z-40 flex h-7 w-7 items-center justify-center rounded-[var(--radius-button)] border border-[var(--color-border)] bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-100 hover:text-[var(--color-text)] max-sm:left-2"
        >
          <PanelLeft className="h-3.5 w-3.5" />
        </button>

        <main
          data-builder-device={device}
          className={cn(
            "flex-1 min-w-0 overflow-y-auto overflow-x-hidden",
            isMobileWorkspace && "bg-slate-100 p-2 sm:p-3",
          )}
        >
          {isNavigating ? (
            <div className="absolute inset-0 z-50 bg-white/88 backdrop-blur-[2px]">
              <StatusLoader
                embedded
                message="Loading page..."
                className="h-full min-h-0 bg-transparent"
              />
            </div>
          ) : null}
          <div
            className={cn(
              "h-full min-w-0",
              isMobileWorkspace &&
                "mx-auto w-full max-w-[430px] overflow-y-auto rounded-[20px] border border-[var(--color-border)] bg-[var(--color-background)] shadow-xl",
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
