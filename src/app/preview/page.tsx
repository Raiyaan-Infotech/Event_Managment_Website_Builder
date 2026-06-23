"use client";

import * as React from "react";
import { StatusLoader } from "@/components/status-pages/status-loader";
import { MaintenanceScreen } from "@/components/status-pages/maintenance-screen";
import { LiveWebsitePreview } from "@/components/website-preview/live-website-preview";
import {
  useVendorAbout,
  useWebsiteBuilderData,
  useWebsitePreviewData,
} from "@/hooks/use-website-builder";
import { apiRequest } from "@/lib/api-client";
import { getVendorPortalLoginUrl, resolveMediaUrl } from "@/lib/utils";
import {
  MAINTENANCE_PAGE_SLUG,
  mergeWebsitePages,
} from "@/app/(builder)/website/pages/_lib/page-store";
import type { VendorWebsitePageRecord } from "@/lib/website-builder-api";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  if (!content || typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function PreviewPage() {
  const [sessionReady, setSessionReady] = React.useState(false);
  const previewRefreshOptions = {
    refetchInterval: sessionReady ? 3_000 : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  } as const;
  const { data: previewData, isLoading: isPreviewLoading } =
    useWebsitePreviewData(previewRefreshOptions);
  const { data: builderData, isLoading: isBuilderLoading } =
    useWebsiteBuilderData(previewRefreshOptions);
  const { data: vendorData, isLoading: isVendorLoading } =
    useVendorAbout(previewRefreshOptions);

  React.useEffect(() => {
    let cancelled = false;

    apiRequest("/vendors/auth/me")
      .then(() => {
        if (!cancelled) setSessionReady(true);
      })
      .catch(() => {
        window.location.replace(getVendorPortalLoginUrl(window.location.href));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ── SEO: map the saved SEO settings onto the preview document head ──
  const seo = (builderData?.seo || {}) as Record<string, unknown>;
  const seoTitle = String(seo.default_title || "").trim();
  const seoDescription = String(seo.default_description || "").trim();
  const seoOgImage = resolveMediaUrl(String(seo.og_image_url || ""));
  const seoSiteName = String(seo.site_name || "").trim();
  const maintenancePage = React.useMemo(
    () =>
      mergeWebsitePages(
        (builderData?.pages || []) as VendorWebsitePageRecord[],
      ).find((page) => page.slug === MAINTENANCE_PAGE_SLUG),
    [builderData?.pages],
  );
  const websiteStatus = String(
    (builderData?.website as Record<string, unknown> | null | undefined)?.status || "",
  );
  const previewTitle = builderData
    ? websiteStatus === "published"
      ? seoTitle
      : maintenancePage?.title || "Maintenance"
    : "";

  React.useEffect(() => {
    if (previewTitle) document.title = previewTitle;
    upsertMeta("name", "description", seoDescription);
    upsertMeta("property", "og:title", previewTitle);
    upsertMeta("property", "og:description", seoDescription);
    upsertMeta("property", "og:site_name", seoSiteName);
    upsertMeta("property", "og:image", seoOgImage);
  }, [previewTitle, seoDescription, seoOgImage, seoSiteName]);

  if (!sessionReady || isPreviewLoading || isBuilderLoading || isVendorLoading) {
    return <StatusLoader message="Loading website preview..." />;
  }

  // ── When the site is unpublished, show the Maintenance design instead ──
  if (websiteStatus !== "published") {
    return (
      <MaintenanceScreen
        title={maintenancePage?.title}
        content={maintenancePage?.content}
      />
    );
  }

  return <LiveWebsitePreview builderData={previewData} vendorData={vendorData} />;
}
