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
}

function SidebarItem({ item, pathname, collapsed }: { item: NavItem; pathname: string; collapsed: boolean }) {
  const Icon = item.icon;
  const active = isActivePath(pathname, item.href);

  return (
    <Link
      href={item.href}
      title={item.label}
      className={cn(
        "flex h-7 w-full items-center rounded-[var(--radius-sidebar-item)] text-[11px] font-medium transition-colors duration-100",
        collapsed ? "justify-center px-0 gap-0" : "gap-1.5 px-2",
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
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      {!collapsed && active && (
        <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-white opacity-70" />
      )}
    </Link>
  );
}

function NavGroupItem({ item, pathname, collapsed }: { item: NavItem; pathname: string; collapsed: boolean }) {
  const [open, setOpen] = React.useState(() => isActivePath(pathname, item.href));
  const Icon = item.icon;
  const hasActiveChild = item.children?.some((child) => isActivePath(pathname, child.href)) ?? false;
  const active = isActivePath(pathname, item.href) || hasActiveChild;

  React.useEffect(() => {
    if (hasActiveChild) setOpen(true);
  }, [hasActiveChild]);

  if (collapsed) {
    return (
      <Link
        href={item.href}
        title={item.label}
        className={cn(
        "flex h-7 w-full items-center justify-center rounded-[var(--radius-sidebar-item)] text-[11px] font-medium transition-colors duration-100",
          active ? "bg-[var(--color-primary)] text-white shadow-sm" : "text-[var(--color-text-secondary)] hover:bg-slate-100",
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
          active ? "bg-[var(--color-primary)] text-white shadow-sm" : "text-[var(--color-text-secondary)] hover:bg-slate-100 hover:text-[var(--color-text)]",
        )}
      >
        <Icon className="h-[13px] w-[13px] shrink-0" strokeWidth={2} />
        <span className="flex-1 truncate text-left">{item.label}</span>
        <ChevronRight
          className={cn("h-3 w-3 shrink-0 transition-transform duration-150", open && "rotate-90")}
        />
      </button>

      {open && item.children ? (
        <div className="ml-1.5 mt-0.5 space-y-0.5 border-l border-[var(--color-border)] pl-2">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "flex h-6 items-center gap-1.5 rounded-[var(--radius-sidebar-item)] px-2 text-[10.5px] font-medium transition-colors duration-100",
                isActivePath(pathname, child.href)
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold"
                  : "text-[var(--color-text-secondary)] hover:bg-slate-100 hover:text-[var(--color-text)]",
              )}
            >
              <child.icon className="h-[11px] w-[11px] shrink-0" strokeWidth={2} />
              <span className="truncate">{child.label}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Sidebar({ pathname, collapsed }: SidebarProps) {
  return (
    <aside
      style={{ width: collapsed ? 48 : 180 }}
      className="fixed bottom-0 left-0 top-[var(--header-height)] z-20 flex flex-col overflow-hidden border-r border-[var(--color-border)] bg-white/95 shadow-sm transition-[width] duration-200 ease-in-out"
    >
      <div className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-2",
        collapsed ? "px-1.5" : "px-2.5",
      )}>
        {navSections.map((section, i) => (
          <div key={i} className="space-y-0.5">
            {section.title && !collapsed && (
              <p className="mb-1 px-1.5 text-[9px] font-semibold uppercase tracking-[0.07em] text-gray-400 whitespace-nowrap">
                {section.title}
              </p>
            )}
            {section.title && collapsed && (
              <div className="my-1 mx-auto h-px w-4 bg-gray-200" />
            )}
            {section.items.map((item) =>
              item.children ? (
                <NavGroupItem key={item.href} item={item} pathname={pathname} collapsed={collapsed} />
              ) : (
                <SidebarItem key={item.href} item={item} pathname={pathname} collapsed={collapsed} />
              ),
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
