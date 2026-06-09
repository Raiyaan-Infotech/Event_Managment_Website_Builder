"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ColorPickerInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
}

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export function ColorPickerInput({
  value,
  onChange,
  label,
  disabled = false,
  className,
  compact = false,
}: ColorPickerInputProps) {
  const colorValue = HEX_COLOR_PATTERN.test(value) ? value : "#000000";

  return (
    <div className={cn(compact ? "space-y-0.5" : "space-y-2", className)}>
      {label ? (
        <label className={cn(compact ? "text-[10px]" : "text-[12px]", "font-black text-[var(--vendor-text)]")}>
          {label}
        </label>
      ) : null}
      <div className={cn(
        "flex items-center gap-2 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] shadow-xs",
        compact ? "h-9 px-1.5" : "h-10 px-2"
      )}>
        <label
          className={cn(
            "relative shrink-0 cursor-pointer overflow-hidden rounded border border-[var(--vendor-border)]",
            compact ? "h-5 w-5" : "h-6 w-6"
          )}
          style={{ backgroundColor: colorValue }}
          aria-label={label ? `Choose ${label}` : "Choose color"}
        >
          <input
            type="color"
            value={colorValue}
            disabled={disabled}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            onChange={(event) => onChange(event.target.value.toUpperCase())}
          />
        </label>
        <Input
          value={value}
          disabled={disabled}
          maxLength={7}
          className="h-full border-0 bg-transparent px-1 font-bold uppercase shadow-none focus-visible:ring-0 text-[10px]"
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          placeholder="#6C47FF"
        />
      </div>
    </div>
  );
}
