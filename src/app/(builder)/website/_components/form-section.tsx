"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  divider?: boolean;
}

export function FormSection({
  title,
  subtitle,
  icon,
  actions,
  children,
  className,
  contentClassName,
  divider = false,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "space-y-2",
        divider && "border-b border-[var(--vendor-border)] pb-3",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {icon ? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[hsl(228_64%_96%)] text-[#2457d6]">
              {icon}
            </div>
          ) : null}
          <div className="min-w-0">
            <h2 className="text-[12.5px] font-bold leading-tight text-[var(--vendor-text)]">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-0.5 text-[10px] font-medium leading-4 text-[var(--vendor-text-muted)]">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      <div className={cn("space-y-2", contentClassName)}>{children}</div>
    </section>
  );
}