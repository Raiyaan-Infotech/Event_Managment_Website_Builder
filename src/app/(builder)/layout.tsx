"use client";

import { usePathname } from "next/navigation";
import { WebsiteBuilderShell } from "@/components/builder/website-builder-shell";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        {children}
      </div>
    </WebsiteBuilderShell>
  );
}