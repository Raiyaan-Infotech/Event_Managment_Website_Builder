"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface ToggleFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function ToggleField({
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: ToggleFieldProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3",
        className,
      )}
    >
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-[var(--vendor-text)]">{label}</p>
        {description ? (
          <p className="mt-0.5 text-[10px] font-medium leading-4 text-[var(--vendor-text-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}
