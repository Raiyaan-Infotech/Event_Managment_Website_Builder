"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { StatusPage } from "@/components/status-pages/status-page";
import { WebsiteBuilderShell } from "@/components/builder/website-builder-shell";
import { StatusLoader } from "@/components/status-pages/status-loader";
import {
  INITIAL_PAGES,
  mergeWebsitePages,
} from "@/app/(builder)/website/pages/_lib/page-store";
import {
  buildUiBlockVisibilityMap,
  resolveHiddenBuilderBlock,
} from "@/app/(builder)/website/_lib/ui-block-visibility";
import {
  useWebsiteBuilderData,
  useWebsitePages,
} from "@/hooks/use-website-builder";
import { apiRequest } from "@/lib/api-client";
import { getVendorPortalLoginUrl } from "@/lib/utils";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCheckingSession, setIsCheckingSession] = React.useState(true);
  const { data: builderData, isLoading: isBuilderDataLoading } =
    useWebsiteBuilderData();
  const { data: pageRecords = [], isLoading: isPagesLoading } =
    useWebsitePages();

  const websitePages = React.useMemo(
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

  const hiddenBlock = React.useMemo(() => {
    if (pathname.startsWith("/website/ui-block")) {
      return null;
    }

    return resolveHiddenBuilderBlock(pathname, visibilityMap, websitePages);
  }, [pathname, visibilityMap, websitePages]);

  const needsPageVisibilityLookup = /^\/website\/pages\/[^/]+\/edit$/.test(pathname);
  const isVisibilityLoading =
    isBuilderDataLoading || (needsPageVisibilityLookup && isPagesLoading);

  React.useEffect(() => {
    let cancelled = false;

    apiRequest("/vendors/auth/me")
      .then(() => {
        if (!cancelled) setIsCheckingSession(false);
      })
      .catch(() => {
        if (!cancelled) {
          window.location.replace(
            getVendorPortalLoginUrl(window.location.href),
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <WebsiteBuilderShell>
      {/*
        Do NOT add overflow-hidden here — the scroll container is <main>
        inside WebsiteBuilderShell. Wrapping children in overflow-hidden
        re-blocks scrolling and is why mobile couldn't scroll to the end.

        h-full ensures the children fill the available height so internal
        flex/grid layouts that depend on height work correctly.
      */}
      <div className="h-full">
        {isCheckingSession ? (
          <StatusLoader embedded message="Checking vendor session..." />
        ) : isVisibilityLoading ? (
          <StatusLoader embedded message="Loading section visibility..." />
        ) : hiddenBlock ? (
          <StatusPage
            embedded
            variant="empty"
            title={`${hiddenBlock.label} is hidden`}
            description="This section is currently hidden from your website settings."
            supportText="Enable it again from Web UI Block if you want it to appear in the sidebar and open for editing."
            actions={[
              {
                label: "Go to UI Block",
                href: "/website/ui-block",
                icon: "back",
              },
              {
                label: "Header",
                href: "/website/basic-information",
                icon: "home",
                variant: "outline",
              },
            ]}
            info={{
              icon: "idea",
              title: "Hidden means unavailable here too",
              description:
                "When a section is hidden, we now remove it from the builder sidebar and block direct access to its builder URL.",
            }}
          />
        ) : (
          children
        )}
      </div>
    </WebsiteBuilderShell>
  );
}
