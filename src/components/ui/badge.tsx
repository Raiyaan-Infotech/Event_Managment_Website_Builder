import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeStatus = "draft" | "published" | "pending" | "rejected" | "default";

const styles: Record<BadgeStatus, string> = {
  draft: "bg-orange-50 text-[var(--color-warning)]",
  published: "bg-green-50 text-[var(--color-success)]",
  pending: "bg-blue-50 text-[var(--color-primary)]",
  rejected: "bg-red-50 text-[var(--color-danger)]",
  default: "bg-slate-100 text-[var(--color-text-secondary)]",
};

export function Badge({
  status = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { status?: BadgeStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-8 items-center rounded-[var(--radius-badge)] px-3 text-[12px] font-semibold",
        styles[status],
        className,
      )}
      {...props}
    />
  );
}
