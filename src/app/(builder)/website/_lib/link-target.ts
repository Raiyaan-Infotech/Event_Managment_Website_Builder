"use client";

import {
  MAINTENANCE_PAGE_SLUG,
  mergeWebsitePages,
  type WebsitePage,
} from "../pages/_lib/page-store";
import type { VendorWebsitePageRecord } from "@/lib/website-builder-api";

export type LinkTargetType = "page" | "custom";

export interface LinkTargetValue {
  linkType: LinkTargetType;
  pageId: string;
  customUrl: string;
}

export interface PageOption {
  label: string;
  value: string;
  href: string;
}

export const DEFAULT_LINK_TARGET: LinkTargetValue = {
  linkType: "page",
  pageId: "",
  customUrl: "",
};

export function buildPageLinkOptions(records: VendorWebsitePageRecord[] = []): PageOption[] {
  const pages = mergeWebsitePages(records).filter(
    (page) => page.enabled && page.slug !== MAINTENANCE_PAGE_SLUG,
  );

  return pages.map((page) => ({
    label: page.title,
    value: String(page.id),
    href: `/${page.slug.replace(/^\/+/, "")}`,
  }));
}

export function findPageHref(pageId: string, options: PageOption[]) {
  return options.find((option) => option.value === pageId)?.href || "";
}

export function resolveLinkTargetHref(target: LinkTargetValue, options: PageOption[]) {
  if (target.linkType === "page") {
    return findPageHref(target.pageId, options);
  }

  const value = target.customUrl.trim();
  if (!value) return "";
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("/") || value.startsWith("#")) {
    return value;
  }
  return `/${value.replace(/^\/+/, "")}`;
}
function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function normalizeLinkTarget(
  raw: unknown,
  options: PageOption[],
  fallbackHref = "",
): LinkTargetValue {
  if (raw && typeof raw === "object") {
    const candidate = raw as Record<string, unknown>;
    const linkType = candidate.linkType === "custom" ? "custom" : "page";
    const pageId =
      asString(candidate.pageId) ||
      asString(candidate.buttonPageId) ||
      asString(candidate.button_page_id);
    const customUrl =
      asString(candidate.customUrl) ||
      asString(candidate.buttonUrl) ||
      asString(candidate.button_url) ||
      asString(candidate.link);

    if (linkType === "page" && pageId) {
      return { linkType, pageId, customUrl };
    }

    if (linkType === "custom") {
      return { linkType, pageId: "", customUrl };
    }
  }

  const fallback = String(raw ?? fallbackHref ?? "");
  const matchedPage = options.find(
    (option) =>
      option.href === fallback ||
      option.href.replace(/^\//, "") === fallback.replace(/^\//, ""),
  );

  if (matchedPage) {
    return {
      linkType: "page",
      pageId: matchedPage.value,
      customUrl: "",
    };
  }

  return {
    linkType: "custom",
    pageId: "",
    customUrl: fallback,
  };
}

export function isPageOptionValue(value: string, options: PageOption[]) {
  return options.some((option) => option.value === value);
}

export function sortPagesByOptions(records: VendorWebsitePageRecord[] = []) {
  return mergeWebsitePages(records).filter(
    (page) => page.enabled && page.slug !== MAINTENANCE_PAGE_SLUG,
  );
}

export type { WebsitePage };
