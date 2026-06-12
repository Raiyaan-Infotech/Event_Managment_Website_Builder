"use client";

import * as React from "react";

export interface WebsitePage {
  id: string;
  title: string;
  slug: string;
  content: string;
  enabled: boolean;
}

export interface PageDraft {
  title: string;
  content: string;
}

export const DEFAULT_PAGE_CONTENT = "<p>Write the content for this page here.</p>";

export const INITIAL_PAGES: WebsitePage[] = [
  {
    id: "about-us",
    title: "About Us",
    slug: "/about-us",
    content:
      "<h2>About Us</h2><p>Tell visitors about your team, story, and event planning experience.</p>",
    enabled: true,
  },
  {
    id: "services",
    title: "Services",
    slug: "/services",
    content:
      "<h2>Our Services</h2><p>Describe the event services, packages, and experiences you offer.</p>",
    enabled: true,
  },
  {
    id: "events",
    title: "Events",
    slug: "/events",
    content:
      "<h2>Events</h2><p>Showcase weddings, corporate events, celebrations, and other event categories.</p>",
    enabled: true,
  },
];

const STORAGE_KEY = "eventify.website.pages";

export function createSlug(title: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `/${slug || "new-page"}`;
}

export function createPageId(title: string, pages: WebsitePage[]) {
  const baseId = createSlug(title).replace(/^\//, "") || "new-page";
  let nextId = baseId;
  let count = 2;

  while (pages.some((page) => page.id === nextId)) {
    nextId = `${baseId}-${count}`;
    count += 1;
  }

  return nextId;
}

function isWebsitePageArray(value: unknown): value is WebsitePage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof (item as WebsitePage).id === "string" &&
        typeof (item as WebsitePage).title === "string" &&
        typeof (item as WebsitePage).slug === "string" &&
        typeof (item as WebsitePage).content === "string" &&
        typeof (item as WebsitePage).enabled === "boolean",
    )
  );
}

export function useWebsitePages() {
  const [pages, setPages] = React.useState<WebsitePage[]>(INITIAL_PAGES);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setIsLoaded(true);
        return;
      }

      const parsed = JSON.parse(saved);
      if (isWebsitePageArray(parsed)) {
        setPages(parsed);
      }
    } catch {
      setPages(INITIAL_PAGES);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const savePages = React.useCallback(
    (nextPages: WebsitePage[] | ((currentPages: WebsitePage[]) => WebsitePage[])) => {
      setPages((currentPages) => {
        const resolvedPages =
          typeof nextPages === "function" ? nextPages(currentPages) : nextPages;

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resolvedPages));
        return resolvedPages;
      });
    },
    [],
  );

  const resetPages = React.useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setPages(INITIAL_PAGES);
  }, []);

  return { pages, savePages, resetPages, isLoaded };
}
