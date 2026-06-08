"use client";

import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface RangeSliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  valueFormatter?: (value: number) => string;
}

export function RangeSliderInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = "%",
  description,
  disabled = false,
  className,
  valueFormatter,
}: RangeSliderInputProps) {
  const displayValue = valueFormatter ? valueFormatter(value) : `${value}${suffix}`;

  const pct = ((value - min) / (max - min)) * 100;

  const trackStyle = {
    background: `linear-gradient(to right, var(--vendor-primary-btn) 0%, var(--vendor-primary-btn) ${pct}%, color-mix(in srgb, var(--vendor-primary-btn) 20%, transparent) ${pct}%, color-mix(in srgb, var(--vendor-primary-btn) 20%, transparent) 100%)`,
  } as React.CSSProperties;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <label className="text-[12px] font-black text-[var(--vendor-text)]">
            {label}
          </label>
          {description ? (
            <p className="mt-1 text-[11px] font-medium text-[var(--vendor-text-muted)]">
              {description}
            </p>
          ) : null}
        </div>
        <span className="min-w-12 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] px-2 py-1 text-center text-[12px] font-black text-[var(--vendor-text)]">
          {displayValue}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        style={trackStyle}
        className="range-slider-input h-2 w-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed"
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}