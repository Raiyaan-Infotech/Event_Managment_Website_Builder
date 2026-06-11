"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { NavItem } from "@/config/navigation";
import { navSections, isActivePath } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  pathname: string;
  collapsed: boolean;
  mobileOpen?: boolean;
  onNavigate?: () => void;
}

const mobilePrimaryHrefs = new Set([
  "/",
  "/bookings",
  "/leads",
  "/payments",
  "/website/hero-section",
  "/website/preview-publish",
  "/settings",
]);

function SidebarItem({
  item,
  pathname,
  collapsed,
  onNavigate,
  mobileHidden = false,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
  mobileHidden?: boolean;
}) {
  const Icon = item.icon;
  const active = isActivePath(pathname, item.href);

  return (
    <Link
      href={item.href}
      title={item.label}
      onClick={onNavigate}
      className={cn(
        "flex h-7 w-full items-center rounded-[var(--radius-sidebar-item)] text-[11px] font-medium transition-colors duration-100",
        collapsed ? "justify-center px-0 gap-0" : "gap-1.5 px-2",
        "max-sm:justify-center max-sm:gap-0 max-sm:px-0",
        mobileHidden && "max-sm:hidden",
        active
          ? "bg-[var(--color-primary)] text-white shadow-sm"
          : "text-[var(--color-text-secondary)] hover:bg-slate-100 hover:text-[var(--color-text)]",
      )}
    >
      <Icon
        className={cn(
          "shrink-0 transition-none",
          collapsed ? "h-3.5 w-3.5" : "h-[13px] w-[13px]",
          active ? "text-white" : "text-gray-400",
        )}
        strokeWidth={2}
      />
      {!collapsed && <span className="flex-1 truncate max-sm:hidden">{item.label}</span>}
      {!collapsed && active && (
        <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-white opacity-70 max-sm:hidden" />
      )}
    </Link>
  );
}

function NavGroupItem({
  item,
  pathname,
  collapsed,
  onNavigate,
  mobileHidden = false,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
  mobileHidden?: boolean;
}) {
  const [open, setOpen] = React.useState(() =>
    isActivePath(pathname, item.href),
  );
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
          "flex h-7 w-full items-center justify-center rounded-[var(--radius-sidebar-item)] text-[11px] font-medium transition-colors duration-100",
          mobileHidden && "max-sm:hidden",
          active
            ? "bg-[var(--color-primary)] text-white shadow-sm"
            : "text-[var(--color-text-secondary)] hover:bg-slate-100",
        )}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-7 w-full items-center gap-1.5 rounded-[var(--radius-sidebar-item)] px-2 text-[11px] font-medium transition-colors duration-100",
          "max-sm:justify-center max-sm:gap-0 max-sm:px-0",
          mobileHidden && "max-sm:hidden",
          active
            ? "bg-[var(--color-primary)] text-white shadow-sm"
            : "text-[var(--color-text-secondary)] hover:bg-slate-100 hover:text-[var(--color-text)]",
        )}
      >
        <Icon className="h-[13px] w-[13px] shrink-0" strokeWidth={2} />
        <span className="flex-1 truncate text-left max-sm:hidden">{item.label}</span>
        <ChevronRight
          className={cn(
            "h-3 w-3 shrink-0 transition-transform duration-150 max-sm:hidden",
            open && "rotate-90",
          )}
        />
      </button>

      {open && item.children ? (
        <div className="ml-1.5 mt-0.5 space-y-0.5 border-l border-[var(--color-border)] pl-2 max-sm:hidden">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              className={cn(
                "flex h-6 items-center gap-1.5 rounded-[var(--radius-sidebar-item)] px-2 text-[10.5px] font-medium transition-colors duration-100",
                "max-sm:justify-center max-sm:gap-0 max-sm:px-0",
                isActivePath(pathname, child.href)
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold"
                  : "text-[var(--color-text-secondary)] hover:bg-slate-100 hover:text-[var(--color-text)]",
              )}
            >
              <child.icon
                className="h-[11px] w-[11px] shrink-0"
                strokeWidth={2}
              />
              <span className="truncate max-sm:hidden">{child.label}</span>
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
  onNavigate,
}: SidebarProps) {
  return (
    <aside
      style={{ width: collapsed ? 48 : 180 }}
      className={cn(
        // KEY FIX: `relative` (not fixed) so the sidebar participates in the
        // flex row. `<main>` then naturally fills the remaining space with no
        // margin hacks needed.
        "relative z-20 flex shrink-0 flex-col overflow-hidden",
        "border-r border-[var(--color-border)] bg-white/95 shadow-sm",
        // Width transition stays — the flex container width animates smoothly
        "transition-[width,transform] duration-200 ease-in-out",
        // Fill the full body height (parent flex row is already h-full)
        "h-full",
        "max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:top-[calc(var(--header-height)+132px)] max-sm:z-30 max-sm:h-auto max-sm:!w-[56px] max-sm:shadow-xl",
        mobileOpen ? "max-sm:translate-x-0" : "max-sm:-translate-x-full",
      )}
    >
      <div
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-2",
          collapsed ? "px-1.5" : "px-2.5",
          "max-sm:px-1.5",
        )}
      >
        {navSections.map((section, i) => (
          <div key={i} className="space-y-0.5">
            {section.title && !collapsed && (
              <p className="mb-1 px-1.5 text-[9px] font-semibold uppercase tracking-[0.07em] text-gray-400 whitespace-nowrap max-sm:hidden">
                {section.title}
              </p>
            )}
            {section.title && collapsed && (
              <div className="my-1 mx-auto h-px w-4 bg-gray-200" />
            )}
            {section.items.map((item) =>
              {
                const hasActiveChild =
                  item.children?.some((child) => isActivePath(pathname, child.href)) ?? false;
                const mobileHidden =
                  !mobilePrimaryHrefs.has(item.href) &&
                  !isActivePath(pathname, item.href) &&
                  !hasActiveChild;

                return item.children ? (
                <NavGroupItem
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                  mobileHidden={mobileHidden}
                />
              ) : (
                <SidebarItem
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                  mobileHidden={mobileHidden}
                />
              );
              }
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
