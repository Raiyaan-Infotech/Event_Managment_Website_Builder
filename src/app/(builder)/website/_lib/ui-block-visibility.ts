"use client";

import type { WebsitePage } from "../pages/_lib/page-store";

export const UI_BLOCK_LABELS: Record<string, string> = {
  "basic-information": "Header",
  pages: "Pages",
  "nav-menu": "Nav Menu",
  "ui-block": "Web UI Block",
  contact_us: "Contact Us",
  "hero-section": "Hero Section",
  "advance-slider": "Advance Slider",
  "gallery-images": "Gallery Images",
  "gallery-categories": "Gallery Categories",
  testimonials: "Testimonials",
  "basic-slider": "Simple Slider",
  "basic-sponsors": "Sponsors",
  "basic-clients": "Clients",
  seo: "SEO Settings",
  footer: "Footer Settings",
  "theme-color": "Theme Color",
};

export const UI_BLOCK_DEFAULT_VISIBILITY: Record<string, boolean> = {
  "basic-information": true,
  pages: true,
  "nav-menu": true,
  "ui-block": true,
  contact_us: true,
  "hero-section": true,
  "advance-slider": true,
  "gallery-images": true,
  "gallery-categories": true,
  testimonials: true,
  "basic-slider": false,
  "basic-sponsors": false,
  "basic-clients": false,
  seo: false,
  footer: true,
  "theme-color": true,
};

export const UI_BLOCK_REQUIRED_KEYS = new Set([
  "basic-information",
  "nav-menu",
  "ui-block",
  "contact_us",
  "hero-section",
  "gallery-images",
  "gallery-categories",
  "footer",
  "theme-color",
  "page:about-us",
  "page:maintenance",
  "page:privacy-policy",
  "page:terms-conditions",
]);

const BUILDER_ROUTE_BLOCKS: Array<{ prefix: string; blockKey: string }> = [
  { prefix: "/website/basic-information", blockKey: "basic-information" },
  { prefix: "/website/pages", blockKey: "pages" },
  { prefix: "/website/menu", blockKey: "nav-menu" },
  { prefix: "/website/ui-block", blockKey: "ui-block" },
  { prefix: "/website/contact-us", blockKey: "contact_us" },
  { prefix: "/website/hero-section", blockKey: "hero-section" },
  { prefix: "/website/simple-slider", blockKey: "basic-slider" },
  { prefix: "/website/advance-slider", blockKey: "advance-slider" },
  { prefix: "/website/gallery/categories", blockKey: "gallery-categories" },
  { prefix: "/website/gallery", blockKey: "gallery-images" },
  { prefix: "/website/testimonials", blockKey: "testimonials" },
  { prefix: "/website/portfolio/clients", blockKey: "basic-clients" },
  { prefix: "/website/portfolio/sponsors", blockKey: "basic-sponsors" },
  { prefix: "/website/seo", blockKey: "seo" },
  { prefix: "/website/footer", blockKey: "footer" },
  { prefix: "/website/theme-color", blockKey: "theme-color" },
];

const CHILD_PARENT_BLOCKS: Record<string, string> = {
};

function getPageBlockKey(slug: string) {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;
  return `page:${normalized}`;
}

export function coerceUiBlockVisible(value: unknown, fallback = true) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["0", "false", "no", "off"].includes(normalized)) return false;
    if (["1", "true", "yes", "on"].includes(normalized)) return true;
  }
  return Boolean(value);
}

export function buildUiBlockVisibilityMap(
  uiBlocks?: Array<Record<string, unknown>>,
) {
  const map = new Map<string, boolean>(
    Object.entries(UI_BLOCK_DEFAULT_VISIBILITY),
  );

  uiBlocks?.forEach((block) => {
    const key = String(block.block_key || block.id || "");
    if (!key) return;
    if (UI_BLOCK_REQUIRED_KEYS.has(key)) {
      map.set(key, true);
      return;
    }
    map.set(
      key,
      coerceUiBlockVisible(
        block.is_visible,
        UI_BLOCK_DEFAULT_VISIBILITY[key] ?? true,
      ),
    );
  });

  return map;
}

export function isUiBlockVisible(
  visibilityMap: Map<string, boolean>,
  blockKey: string | null | undefined,
) {
  if (!blockKey) return true;
  if (UI_BLOCK_REQUIRED_KEYS.has(blockKey)) return true;
  return visibilityMap.get(blockKey) ?? UI_BLOCK_DEFAULT_VISIBILITY[blockKey] ?? true;
}

export function resolveBuilderBlockKeyForPath(
  pathname: string,
  websitePages: WebsitePage[] = [],
) {
  const editMatch = pathname.match(/^\/website\/pages\/([^/]+)\/edit$/);
  if (editMatch) {
    const pageId = decodeURIComponent(editMatch[1]);
    const page = websitePages.find((item) => String(item.routeKey) === pageId);
    return getPageBlockKey(page?.slug || "") || "pages";
  }

  for (const route of BUILDER_ROUTE_BLOCKS) {
    if (pathname === route.prefix || pathname.startsWith(`${route.prefix}/`)) {
      return route.blockKey;
    }
  }

  return null;
}

export function resolveHiddenBuilderBlock(
  pathname: string,
  visibilityMap: Map<string, boolean>,
  websitePages: WebsitePage[] = [],
) {
  const blockKey = resolveBuilderBlockKeyForPath(pathname, websitePages);
  if (!blockKey) {
    return null;
  }

  const parentBlockKey = CHILD_PARENT_BLOCKS[blockKey];
  if (parentBlockKey && !isUiBlockVisible(visibilityMap, parentBlockKey)) {
    return {
      blockKey: parentBlockKey,
      label: UI_BLOCK_LABELS[parentBlockKey] || parentBlockKey,
    };
  }

  if (isUiBlockVisible(visibilityMap, blockKey)) {
    return null;
  }

  return {
    blockKey,
    label:
      UI_BLOCK_LABELS[blockKey] ||
      websitePages.find((page) => getPageBlockKey(page.slug) === blockKey)?.title ||
      blockKey,
  };
}

export function getBuilderNavBlockKey(href: string, label?: string) {
  if (label === "Pages") return "pages";
  if (label === "Web UI Block") return "ui-block";
  if (label === "Slider") return null;
  if (label === "Gallery") return null;
  if (label === "Categories" || label === "Contact List") return "contact_us";
  if (label === "Gallery Images") return "gallery-images";
  if (label === "Gallery Categories") return "gallery-categories";
  return resolveBuilderBlockKeyForPath(href, []);
}

export function getParentUiBlockKey(blockKey: string | null | undefined) {
  if (!blockKey) return null;
  if (blockKey.startsWith("page:")) return "pages";
  return CHILD_PARENT_BLOCKS[blockKey] || null;
}

export function getPageVisibilityBlockKey(page: WebsitePage) {
  return getPageBlockKey(page.slug);
}
