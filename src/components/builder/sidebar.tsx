"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, FileText, List } from "lucide-react";
import type { NavItem } from "@/config/navigation";
import { navSections, isActivePath } from "@/config/navigation";
import {
  INITIAL_PAGES,
  mergeWebsitePages,
  type WebsitePage,
} from "@/app/(builder)/website/pages/_lib/page-store";
import {
  buildUiBlockVisibilityMap,
  getBuilderNavBlockKey,
  getParentUiBlockKey,
  getPageVisibilityBlockKey,
  isUiBlockVisible,
} from "@/app/(builder)/website/_lib/ui-block-visibility";
import {
  useWebsiteBuilderData,
  useWebsitePages,
} from "@/hooks/use-website-builder";
import { cn } from "@/lib/utils";

interface SidebarProps {
  pathname: string;
  collapsed: boolean;
  mobilePreview?: boolean;
  mobileOpen?: boolean;
  mobileActionsVisible?: boolean;
  onCloseMobile?: () => void;
  onNavigate?: (href: string) => void;
}

function SidebarItem({
  item,
  pathname,
  collapsed,
  onNavigate,
  onCloseMobile,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate?: (href: string) => void;
  onCloseMobile?: () => void;
}) {
  const Icon = item.icon;
  const active = isActivePath(pathname, item.href);
  const handleClick = () => {
    onCloseMobile?.();
    onNavigate?.(item.href);
  };

  return (
    <Link
      href={item.href}
      title={item.label}
      onClick={handleClick}
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
          "shrink-0 h-4 w-4",
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
  onCloseMobile,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  onNavigate?: (href: string) => void;
  onCloseMobile?: () => void;
}) {
  const [open, setOpen] = React.useState(() => isActivePath(pathname, item.href));
  const Icon = item.icon;
  const hasActiveChild =
    item.children?.some((child) => isActivePath(pathname, child.href)) ?? false;
  const active = isActivePath(pathname, item.href) || hasActiveChild;
  const handleRootClick = () => {
    onCloseMobile?.();
    onNavigate?.(item.href);
  };

  React.useEffect(() => {
    if (hasActiveChild) setOpen(true);
  }, [hasActiveChild]);

  if (collapsed) {
    return (
      <Link
        href={item.href}
        title={item.label}
        onClick={handleRootClick}
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
              onClick={() => {
                onCloseMobile?.();
                onNavigate?.(child.href);
              }}
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
  mobilePreview = false,
  mobileOpen = false,
  mobileActionsVisible = false,
  onCloseMobile,
  onNavigate,
}: SidebarProps) {
  const { data: builderData } = useWebsiteBuilderData();
  const { data: pageRecords = [] } = useWebsitePages();
  const websitePages = React.useMemo<WebsitePage[]>(
    () => (pageRecords.length > 0 ? mergeWebsitePages(pageRecords) : INITIAL_PAGES),
    [pageRecords],
  );
  const visibilityMap = React.useMemo(
    () =>
      buildUiBlockVisibilityMap(
        builderData?.uiBlocks as Array<Record<string, unknown>> | undefined,
      ),
    [builderData?.uiBlocks],
  );
  const uiBlockOrderMap = React.useMemo(() => {
    const map = new Map<string, number>();
    const blocks = builderData?.uiBlocks as Array<Record<string, unknown>> | undefined;

    blocks?.forEach((block, index) => {
      const key = String(block.block_key || block.id || "");
      if (!key) return;
      map.set(key, Number(block.sort_order || index + 1));
    });

    return map;
  }, [builderData?.uiBlocks]);
  const drawerExpanded = mobileOpen;
  const effectiveCollapsed = drawerExpanded ? false : collapsed;
  const effectiveMobilePreview = drawerExpanded ? false : mobilePreview;

  const resolvedNavSections = React.useMemo(() => {
    const getNavItemOrder = (item: NavItem) => {
      const blockKey = getBuilderNavBlockKey(item.href, item.label);
      if (blockKey) {
        return uiBlockOrderMap.get(blockKey) ?? Number.MAX_SAFE_INTEGER;
      }

      if (item.children?.length) {
        return Math.min(
          ...item.children.map((child) => {
            const childBlockKey = getBuilderNavBlockKey(child.href, child.label);
            return childBlockKey
              ? uiBlockOrderMap.get(childBlockKey) ?? Number.MAX_SAFE_INTEGER
              : Number.MAX_SAFE_INTEGER;
          }),
        );
      }

      return Number.MAX_SAFE_INTEGER;
    };

    const byUiBlockOrder = (left: NavItem, right: NavItem) =>
      getNavItemOrder(left) - getNavItemOrder(right);

    const filterItem = (item: NavItem): NavItem | null => {
      if (item.href === "/website/pages") {
        if (!isUiBlockVisible(visibilityMap, "pages")) {
          return null;
        }

        const visiblePageChildren = websitePages
          .filter((page) =>
            isUiBlockVisible(
              visibilityMap,
              getPageVisibilityBlockKey(page),
            ),
          )
          .sort((left, right) => {
            const leftKey = getPageVisibilityBlockKey(left);
            const rightKey = getPageVisibilityBlockKey(right);
            return (
              (leftKey ? uiBlockOrderMap.get(leftKey) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER) -
              (rightKey ? uiBlockOrderMap.get(rightKey) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER)
            );
          })
          .map((page) => ({
            label: page.title,
            icon: FileText,
            href: `/website/pages/${encodeURIComponent(page.routeKey)}/edit`,
          }));

        return {
          ...item,
          href: "/website/pages/create",
          children: [
            {
              label: "Pages List",
              icon: List,
              href: "/website/pages/list",
            },
            {
              label: "Create Page",
              icon: FileText,
              href: "/website/pages/create",
            },
            ...visiblePageChildren,
          ],
        };
      }

      const blockKey = getBuilderNavBlockKey(item.href, item.label);
      if (blockKey && !isUiBlockVisible(visibilityMap, blockKey)) {
        return null;
      }

      if (!item.children?.length) {
        return item;
      }

      const children = item.children
        .filter((child) => {
          const childBlockKey = getBuilderNavBlockKey(child.href, child.label);
          const parentBlockKey = getParentUiBlockKey(childBlockKey);
          return (
            isUiBlockVisible(visibilityMap, parentBlockKey) &&
            isUiBlockVisible(visibilityMap, childBlockKey)
          );
        })
        .sort(byUiBlockOrder);

      if (!children.length) {
        return null;
      }

      return {
        ...item,
        children,
      };
    };

    return navSections
      .map((section) => ({
        ...section,
        items: section.items
          .map((item) => filterItem(item))
          .filter((item): item is NavItem => item !== null),
      }))
      .filter((section) => section.items.length > 0);
  }, [uiBlockOrderMap, visibilityMap, websitePages]);

  return (
    <>
      {/* ── Mobile dark backdrop ───────────────────────────────────────── */}
      <div
        onClick={onCloseMobile}
        className={cn(
          "fixed inset-0 z-20 bg-black/40 backdrop-blur-[2px] sm:hidden transition-opacity duration-200",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      />

      {/* ── Sidebar panel ─────────────────────────────────────────────── */}
      <aside
        style={{ width: effectiveCollapsed || effectiveMobilePreview ? 48 : 220 }}
        className={cn(
          "relative z-30 flex shrink-0 flex-col overflow-hidden",
          "border-r border-[var(--color-border)] bg-white shadow-sm",
          "transition-[width,transform] duration-200 ease-in-out",
          "h-full max-sm:h-[calc(100dvh-var(--header-height))]",
          "max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:z-30 max-sm:!w-[220px] max-sm:shadow-2xl",
          "max-sm:top-[var(--header-height)]",
          mobileOpen ? "max-sm:translate-x-0" : "max-sm:-translate-x-full",
        )}
      >
        {/* ── Nav items ─────────────────────────────────────────────── */}
        <div
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-3",
            effectiveCollapsed ? "px-1.5" : "px-3",
          )}
        >
          {resolvedNavSections.map((section, i) => (
            <div key={i} className="space-y-0.5">
              {section.title && !effectiveCollapsed && (
                <p className="mb-1.5 px-2 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-gray-400 whitespace-nowrap">
                  {section.title}
                </p>
              )}
              {section.title && effectiveCollapsed && (
                <div className="my-1 mx-auto h-px w-4 bg-gray-200" />
              )}
              {section.items.map((item) =>
                item.children ? (
                  <NavGroupItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    collapsed={effectiveCollapsed}
                    onCloseMobile={onCloseMobile}
                    onNavigate={onNavigate}
                  />
                ) : (
                  <SidebarItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    collapsed={effectiveCollapsed}
                    onCloseMobile={onCloseMobile}
                    onNavigate={onNavigate}
                  />
                ),
              )}
            </div>
          ))}
        </div>

        {/* ── User profile footer ───────────────────────────────────────── */}
      </aside>
    </>
  );
}
