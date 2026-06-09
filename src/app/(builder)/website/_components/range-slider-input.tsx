"use client";

import { cn } from "@/lib/utils";

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

  // Pass the gradient as a CSS custom property (variable)
  // so that the Webkit and Firefox track pseudo-elements can inherit it.
  const trackBg = `linear-gradient(to right, var(--vendor-primary-btn) 0%, var(--vendor-primary-btn) ${pct}%, color-mix(in srgb, var(--vendor-primary-btn) 20%, transparent) ${pct}%, color-mix(in srgb, var(--vendor-primary-btn) 20%, transparent) 100%)`;

  const inlineStyle = {
    "--slider-track-bg": trackBg,
  } as React.CSSProperties;

  return (
    <div className={cn("flex items-center justify-between gap-2.5", className)}>
      <div className="flex-1 min-w-[72px] leading-tight">
        <label className="text-[10px] font-bold text-[var(--vendor-text)] truncate block">
          {label}
        </label>
        {description ? (
          <p className="mt-0.5 text-[8px] font-medium text-[var(--vendor-text-muted)] leading-none">
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex-grow max-w-[110px]">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          style={inlineStyle}
          className="range-slider-input w-full cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed"
          onInput={(e) => onChange(Number(e.currentTarget.value))}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>

      <span className="shrink-0 min-w-[34px] rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] px-1 py-0.5 text-center text-[9px] font-bold text-[var(--vendor-text)]">
        {displayValue}
      </span>
    </div>
  );
}
