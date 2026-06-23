"use client";

import type { VendorWebsitePageRecord } from "@/lib/website-builder-api";

export interface WebsitePage {
  id: number | string;
  routeKey: string;
  title: string;
  slug: string;
  content: string;
  enabled: boolean;
  pageType: string;
  status: string;
  isSystem: boolean;
  isPersisted: boolean;
  sortOrder: number;
}

export interface PageDraft {
  title: string;
  content: string;
  enabled: boolean;
}

export const DEFAULT_PAGE_CONTENT = "<p> </p>";

const SYSTEM_PAGES: Array<{
  routeKey: string;
  title: string;
  slug: string;
  content: string;
  pageType: string;
}> = [
  {
    routeKey: "about-us",
    title: "About Us",
    slug: "about-us",
    content:
      "<h2>About Us</h2><p>Tell visitors about your team, story, and event planning experience.</p>",
    pageType: "system",
  },
  {
    routeKey: "services",
    title: "Services",
    slug: "services",
    content:
      "<h2>Our Services</h2><p>Describe the event services, packages, and experiences you offer.</p>",
    pageType: "system",
  },
  {
    routeKey: "events",
    title: "Events",
    slug: "events",
    content:
      "<h2>Events</h2><p>Showcase weddings, corporate events, celebrations, and other event categories.</p>",
    pageType: "system",
  },
];

export const INITIAL_PAGES: WebsitePage[] = SYSTEM_PAGES.map((page, index) => ({
  id: page.routeKey,
  routeKey: page.routeKey,
  title: page.title,
  slug: page.slug,
  content: page.content,
  enabled: true,
  pageType: page.pageType,
  status: "published",
  isSystem: true,
  isPersisted: false,
  sortOrder: index + 1,
}));

export function createSlug(title: string) {
  return (
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "new-page"
  );
}

export function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function createUniqueSlug(title: string, pages: WebsitePage[], excludeId?: number | string) {
  const baseSlug = createSlug(title);
  let nextSlug = baseSlug;
  let suffix = 2;

  while (
    pages.some(
      (page) =>
        page.id !== excludeId &&
        page.slug.toLowerCase() === nextSlug.toLowerCase(),
    )
  ) {
    nextSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return nextSlug;
}

export function toPageDraft(page: WebsitePage): PageDraft {
  return {
    title: page.title,
    content: page.content,
    enabled: page.enabled,
  };
}

export function normalizeWebsitePage(record: VendorWebsitePageRecord): WebsitePage {
  return {
    id: record.id,
    routeKey: String(record.id),
    title: record.title || "Untitled Page",
    slug: (record.slug || "").replace(/^\/+/, "") || `page-${record.id}`,
    content: record.content || DEFAULT_PAGE_CONTENT,
    enabled: Boolean(record.is_active) && record.status !== "draft",
    pageType: record.page_type || "custom",
    status: record.status || "draft",
    isSystem: Boolean(record.is_system),
    isPersisted: true,
    sortOrder: Number(record.sort_order || 0),
  };
}

export function mergeWebsitePages(records: VendorWebsitePageRecord[] = []) {
  const persistedPages = records.map(normalizeWebsitePage);
  const pagesBySlug = new Set(
    persistedPages.map((page) => page.slug.toLowerCase()),
  );

  const fallbackPages = INITIAL_PAGES.filter(
    (page) => !pagesBySlug.has(page.slug.toLowerCase()),
  );

  return [...persistedPages, ...fallbackPages].sort((left, right) => {
    const leftRank = left.sortOrder || Number.MAX_SAFE_INTEGER;
    const rightRank = right.sortOrder || Number.MAX_SAFE_INTEGER;

    if (leftRank !== rightRank) return leftRank - rightRank;
    return left.title.localeCompare(right.title);
  });
}

export function buildPagePayload(
  draft: PageDraft,
  pages: WebsitePage[],
  options?: {
    page?: WebsitePage;
    isSystem?: boolean;
  },
) {
  const cleanTitle = draft.title.trim() || "Untitled Page";
  const currentPage = options?.page;
  const slug = createUniqueSlug(cleanTitle, pages, currentPage?.id);
  const content = draft.content.trim() || DEFAULT_PAGE_CONTENT;
  const description = stripHtml(content).slice(0, 160);
  const isSystem = options?.isSystem ?? currentPage?.isSystem ?? false;

  return {
    title: cleanTitle,
    slug,
    content,
    excerpt: description || null,
    seo_title: cleanTitle,
    seo_description: description || null,
    status: draft.enabled ? "published" : "draft",
    is_active: draft.enabled,
    page_type: isSystem ? "system" : currentPage?.pageType || "custom",
    is_system: isSystem,
    sort_order: currentPage?.sortOrder || pages.length + 1,
  };
}
