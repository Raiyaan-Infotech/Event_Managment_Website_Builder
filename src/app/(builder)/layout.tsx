"use client";

import * as React from "react";
import { WebsiteBuilderShell } from "@/components/builder/website-builder-shell";
import { StatusLoader } from "@/components/status-pages/status-loader";
import { apiRequest } from "@/lib/api-client";
import { getVendorPortalLoginUrl } from "@/lib/utils";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCheckingSession, setIsCheckingSession] = React.useState(true);

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
        ) : (
          children
        )}
      </div>
    </WebsiteBuilderShell>
  );
}
