"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, FileText, ChevronRight as ArrowRight } from "lucide-react";
import type { NavItem } from "@/config/navigation";
import { navSections, isActivePath } from "@/config/navigation";
import {
  INITIAL_PAGES,
  STORAGE_KEY as WEBSITE_PAGES_STORAGE_KEY,
  type WebsitePage,
} from "@/app/(builder)/website/pages/_lib/page-store";
import { cn } from "@/lib/utils";

interface SidebarProps {
  pathname: string;
  collapsed: boolean;
  mobileOpen?: boolean;
  mobileActionsVisible?: boolean;
  onNavigate?: () => void;
}

function isWebsitePageArray(value: unknown): value is WebsitePage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof (item as WebsitePage).id === "string" &&
        typeof (item as WebsitePage).title === "string",
    )
  );
}

function readWebsitePages() {
  try {
    const saved = window.localStorage.getItem(WEBSITE_PAGES_STORAGE_KEY);
    if (!saved) return INITIAL_PAGES;
    const parsed = JSON.parse(saved);
    return isWebsitePageArray(parsed) ? parsed : INITIAL_PAGES;
  } catch {
    return INITIAL_PAGES;
  }
}

function SidebarItem({
  item,
  pathname,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const active = isActivePath(pathname, item.href);

  return (
    <Link
      href={item.href}
      title={item.label}
      onClick={onNavigate}
      className={cn(
        "flex h-8 w-full items-center rounded-[var(--radius-sidebar-item)] text-[12px] font-medium transition-colors duration-100",
        collapsed ? "justify-center px-0 gap-0" : "gap-2.5 px-2.5",
        active
          ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
          : "text-[var(--color-text-secondary)] hover:bg-slate-100 hover:text-[var(--color-text)]",
      )}
    >
      <Icon
        className={cn(
          "shrink-0",
          collapsed ? "h-4 w-4" : "h-4 w-4",
          active ? "text-[var(--color-primary)]" : "text-gray-400",
        )}
        strokeWidth={1.8}
      />
      {!collapsed && (
        <span className="flex-1 truncate">{item.label}</span>
      )}
    </Link>
  );
}

function NavGroupItem({
  item,
  pathname,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = React.useState(() => isActivePath(pathname, item.href));
  const Icon = item.icon;
  const hasActiveChild =
    item.children?.some((child) => isActivePath(pathname, child.href)) ?? false;
  const active = isActivePath(pathname, item.href) || hasActiveChild;

  React.useEffect(() => {
    if (hasActiveChild) setOpen(true);
  }, [hasActiveChild]);

  if (collapsed) {
    return (
      <Link
        href={item.href}
        title={item.label}
        onClick={onNavigate}
        className={cn(
          "flex h-8 w-full items-center justify-center rounded-[var(--radius-sidebar-item)] text-[12px] font-medium transition-colors duration-100",
          active
            ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
            : "text-[var(--color-text-secondary)] hover:bg-slate-100",
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </Link>
    );
  }

  return (
    <div>
      <button
        title={item.label}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-8 w-full items-center gap-2.5 rounded-[var(--radius-sidebar-item)] px-2.5 text-[12px] font-medium transition-colors duration-100",
          active
            ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
            : "text-[var(--color-text-secondary)] hover:bg-slate-100 hover:text-[var(--color-text)]",
        )}
      >
        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
        <span className="flex-1 truncate text-left">{item.label}</span>
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-150",
            open && "rotate-90",
          )}
        />
      </button>

      {open && item.children ? (
        <div className="ml-2 mt-0.5 space-y-0.5 border-l border-[var(--color-border)] pl-3">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              title={child.label}
              onClick={onNavigate}
              className={cn(
                "flex h-7 items-center gap-2 rounded-[var(--radius-sidebar-item)] px-2 text-[11.5px] font-medium transition-colors duration-100",
                isActivePath(pathname, child.href)
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold"
                  : "text-[var(--color-text-secondary)] hover:bg-slate-100 hover:text-[var(--color-text)]",
              )}
            >
              <child.icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
              <span className="truncate">{child.label}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Sidebar({
  pathname,
  collapsed,
  mobileOpen = false,
  mobileActionsVisible = false,
  onNavigate,
}: SidebarProps) {
  const [websitePages, setWebsitePages] = React.useState<WebsitePage[]>(INITIAL_PAGES);

  React.useEffect(() => {
    setWebsitePages(readWebsitePages());
  }, [pathname]);

  const resolvedNavSections = React.useMemo(
    () =>
      navSections.map((section) => ({
        ...section,
        items: section.items.map((item) => {
          if (item.href !== "/website/pages") return item;
          return {
            ...item,
            children: [
              ...websitePages.map((page) => ({
                label: page.title,
                icon: FileText,
                href: `/website/pages/${encodeURIComponent(page.id)}/edit`,
              })),
              {
                label: "Create Page",
                icon: FileText,
                href: "/website/pages/create",
              },
            ],
          };
        }),
      })),
    [websitePages],
  );

  return (
    <>
      {/* ── Mobile dark backdrop ───────────────────────────────────────── */}
      <div
        onClick={onNavigate}
        className={cn(
          "fixed inset-0 z-20 bg-black/40 backdrop-blur-[2px] sm:hidden transition-opacity duration-200",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      />

      {/* ── Sidebar panel ─────────────────────────────────────────────── */}
      <aside
        style={{ width: collapsed ? 48 : 200 }}
        className={cn(
          "relative z-30 flex shrink-0 flex-col overflow-hidden",
          "border-r border-[var(--color-border)] bg-white shadow-sm",
          "transition-[width,transform] duration-200 ease-in-out",
          "h-full",
          // Mobile: full overlay drawer, always wide (220px), slides in/out
          "max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:z-30 max-sm:!w-[220px] max-sm:shadow-2xl",
          "max-sm:top-[var(--header-height)]",
          mobileOpen ? "max-sm:translate-x-0" : "max-sm:-translate-x-full",
        )}
      >
        {/* Nav items */}
        <div
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-3",
            collapsed ? "px-1.5" : "px-3",
          )}
        >
          {resolvedNavSections.map((section, i) => (
            <div key={i} className="space-y-0.5">
              {section.title && !collapsed && (
                <p className="mb-1.5 px-2 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-gray-400 whitespace-nowrap">
                  {section.title}
                </p>
              )}
              {section.title && collapsed && (
                <div className="my-1 mx-auto h-px w-4 bg-gray-200" />
              )}
              {section.items.map((item) =>
                item.children ? (
                  <NavGroupItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                  />
                ) : (
                  <SidebarItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                  />
                ),
              )}
            </div>
          ))}
        </div>

        {/* ── User profile footer ───────────────────────────────────────── */}
        {!collapsed && (
          <div className="shrink-0 border-t border-[var(--color-border)] p-3">
            <Link
              href="/settings"
              onClick={onNavigate}
              className="flex items-center gap-2.5 rounded-[var(--radius-sidebar-item)] px-2 py-2 transition-colors hover:bg-slate-100"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white">
                RK
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-[var(--color-text)]">
                  Royal Kraft
                </p>
                <p className="truncate text-[10px] text-[var(--color-text-secondary)]">
                  View Profile
                </p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            </Link>
          </div>
        )}

        {collapsed && (
          <div className="shrink-0 border-t border-[var(--color-border)] p-1.5 flex justify-center">
            <Link
              href="/settings"
              onClick={onNavigate}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white hover:opacity-90 transition-opacity"
            >
              RK
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}