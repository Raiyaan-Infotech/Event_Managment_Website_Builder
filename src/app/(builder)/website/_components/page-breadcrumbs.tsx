"use client";

import type * as React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const segmentLabels: Record<string, string> = {
  "": "Dashboard",
  website: "Website Builder",
  header: "Header",
  menu: "Menu Management",
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
  bookings: "Bookings",
  leads: "Leads",
  customers: "Customers",
  payments: "Payments",
  reviews: "Reviews",
  analytics: "Analytics",
  settings: "Settings",
};

const baseHrefs: Record<string, string> = {
  "": "/",
  website: "/website",
};

interface PageBreadcrumbsProps {
  overrides?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function PageBreadcrumbs({ overrides, className }: PageBreadcrumbsProps) {
  const pathname = usePathname();

  if (overrides) {
    return (
      <nav className={cn("flex flex-wrap items-center gap-2 text-[13px] font-semibold text-[var(--vendor-text-muted)]", className)} aria-label="Breadcrumb">
        {overrides.map((item, index) => {
          const isLast = index === overrides.length - 1;
          return (
            <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {item.href && !isLast ? (
                <a className="hover:text-[var(--vendor-primary-btn)]" href={item.href}>{item.label}</a>
              ) : (
                <span className={isLast ? "text-[var(--vendor-text)]" : ""}>{item.label}</span>
              )}
              {!isLast ? <span className="text-[var(--vendor-text-muted)]">›</span> : null}
            </span>
          );
        })}
      </nav>
    );
  }

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Array<{ label: string; href?: string }> = [{ label: "Dashboard", href: "/" }];

  let cumulative = "";
  for (let i = 0; i < segments.length; i++) {
    cumulative += "/" + segments[i];
    const label = segmentLabels[segments[i]] || segments[i].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const isLast = i === segments.length - 1;
    crumbs.push({ label, href: isLast ? undefined : cumulative });
  }

  return (
    <nav className={cn("flex flex-wrap items-center gap-2 text-[13px] font-semibold text-[var(--vendor-text-muted)]", className)} aria-label="Breadcrumb">
      {crumbs.map((item, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {item.href && !isLast ? (
              <a className="hover:text-[var(--vendor-primary-btn)]" href={item.href}>{item.label}</a>
            ) : (
              <span className={isLast ? "text-[var(--vendor-text)]" : ""}>{item.label}</span>
            )}
            {!isLast ? <span className="text-[var(--vendor-text-muted)]">›</span> : null}
          </span>
        );
      })}
    </nav>
  );
}
