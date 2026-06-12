"use client";

import type * as React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const segmentLabels: Record<string, string> = {
  "": "Dashboard",
  website: "Website Builder",
  header: "Header",
  menu: "Nav Menu",
  "hero-section": "Hero Section",
  "simple-slider": "Simple Slider",
  "advance-slider": "Advance Slider",
  gallery: "Gallery",
  testimonials: "Testimonials",
  "contact-information": "Contact Information",
  footer: "Footer",
  seo: "SEO",
  pages: "Pages",
  "preview-publish": "Preview & Publish",
  portfolio: "Portfolio",
  setup: "Website Setup",
};

const baseHrefs: Record<string, string> = {
  "": "/",
  website: "/website",
};

interface PageBreadcrumbsProps {
  overrides?: Array<{ label: string; href?: string }>;
  className?: string;
}

function BreadcrumbNav({
  crumbs,
  className,
}: {
  crumbs: Array<{ label: string; href?: string }>;
  className?: string;
}) {
  return (
    <nav
      // Single row, horizontally scrollable — never wraps on narrow screens.
      // scrollbar-none hides the scrollbar chrome while keeping it functional.
      className={cn(
        "flex items-center gap-1 overflow-x-auto scrollbar-none",
        // Compact on mobile, slightly larger on sm+
        "text-[10px] sm:text-[11px] font-semibold text-[var(--vendor-text-muted)]",
        // Prevent text from being crushed on very small viewports
        "whitespace-nowrap",
        className,
      )}
      aria-label="Breadcrumb"
    >
      {crumbs.map((item, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span
            key={`${item.label}-${index}`}
            className="inline-flex items-center gap-1 shrink-0"
          >
            {item.href && !isLast ? (
              <a
                className="hover:text-[var(--vendor-primary-btn)] transition-colors"
                href={item.href}
              >
                {item.label}
              </a>
            ) : (
              <span
                className={
                  isLast ? "text-[var(--vendor-text)] font-bold" : ""
                }
              >
                {item.label}
              </span>
            )}
            {!isLast ? (
              <span
                className="text-[var(--vendor-text-muted)] opacity-50 select-none"
                aria-hidden="true"
              >
                ›
              </span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}

export function PageBreadcrumbs({ overrides, className }: PageBreadcrumbsProps) {
  const pathname = usePathname();

  if (overrides) {
    return <BreadcrumbNav crumbs={overrides} className={className} />;
  }

  const segments = pathname ? pathname.split("/").filter(Boolean) : [];
  const crumbs: Array<{ label: string; href?: string }> = [
    { label: "Dashboard", href: "/" },
  ];

  let cumulative = "";
  for (let i = 0; i < segments.length; i++) {
    cumulative += "/" + segments[i];
    const label =
      segmentLabels[segments[i]] ||
      segments[i]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    const isLast = i === segments.length - 1;
    crumbs.push({ label, href: isLast ? undefined : cumulative });
  }

  return <BreadcrumbNav crumbs={crumbs} className={className} />;
}