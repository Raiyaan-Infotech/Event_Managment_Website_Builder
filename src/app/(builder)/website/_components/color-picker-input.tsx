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
}

const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export function ColorPickerInput({
  value,
  onChange,
  label,
  disabled = false,
  className,
}: ColorPickerInputProps) {
  const colorValue = HEX_COLOR_PATTERN.test(value) ? value : "#000000";

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label className="text-[12px] font-black text-[var(--vendor-text)]">{label}</label>
      ) : null}
      <div className="flex h-10 items-center gap-2 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] px-2 shadow-xs">
        <label
          className="relative h-6 w-6 shrink-0 cursor-pointer overflow-hidden rounded border border-[var(--vendor-border)]"
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
          className="h-8 border-0 bg-transparent px-1 font-bold uppercase shadow-none focus-visible:ring-0"
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          placeholder="#6C47FF"
        />
      </div>
    </div>
  );
}
