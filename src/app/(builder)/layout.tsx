"use client";

import { usePathname } from "next/navigation";
import { WebsiteBuilderShell } from "@/components/builder/website-builder-shell";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBuilderPage = pathname?.includes("/website");

  return (
    <WebsiteBuilderShell>
      {/* This div is the scroll container.
          For website builder pages, we lock overflow to hidden so only internal columns scroll.
          For other dashboard pages, we keep overflow-y-auto to allow standard scrolling. */}
      <div className={isBuilderPage ? "h-full overflow-hidden" : "h-full overflow-y-auto"}>
        {children}
      </div>
    </WebsiteBuilderShell>
  );
}