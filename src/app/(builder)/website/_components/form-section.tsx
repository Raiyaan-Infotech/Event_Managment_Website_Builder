"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title?: string;
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
  const hasHeader = Boolean(title || subtitle || icon || actions);

  return (
    <section
      className={cn(
        "space-y-2",
        divider && "border-b border-[var(--vendor-border)] pb-3",
        className,
      )}
    >
      {hasHeader ? (
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2">
            {icon ? (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[hsl(228_64%_96%)] text-[#2457d6] sm:h-9 sm:w-9 sm:rounded-[10px]">
                {icon}
              </div>
            ) : null}

            {title || subtitle ? (
              <div className="min-w-0 flex-1 pt-0.5">
                {title ? (
                  <h2 className="truncate text-[11.5px] font-bold leading-tight text-[var(--vendor-text)] sm:text-[12.5px]">
                    {title}
                  </h2>
                ) : null}
                {subtitle ? (
                  <p className="mt-0.5 text-[9.5px] font-medium leading-[1.3] text-[var(--vendor-text-muted)] sm:text-[10px] sm:leading-4">
                    {subtitle}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          {actions ? (
            <div className="shrink-0 self-start">{actions}</div>
          ) : null}
        </div>
      ) : null}

      {/* Content area */}
      <div className={cn("space-y-2", contentClassName)}>{children}</div>
    </section>
  );
}
