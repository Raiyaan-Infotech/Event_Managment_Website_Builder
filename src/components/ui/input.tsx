import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full min-w-0 max-w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-3 text-[11px] font-medium text-[var(--color-text)] outline-none transition duration-150 ease-in-out placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10",
        className,
      )}
      {...props}
    />
  );
}
