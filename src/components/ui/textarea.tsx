import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[120px] w-full resize-none rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-3 py-2 text-[12px] font-medium leading-5 text-[var(--color-text)] outline-none transition duration-150 ease-in-out placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10",
        className,
      )}
      {...props}
    />
  );
}
