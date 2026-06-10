"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ─── BuilderLabel ────────────────────────────────────────────────────────────

interface BuilderLabelProps {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export function BuilderLabel({
  children,
  required = false,
  className,
}: BuilderLabelProps) {
  return (
    <label
      className={cn(
        // Mobile: slightly bigger for legibility; md+ stays at 10px
        "text-[10px] font-semibold text-slate-600",
        className,
      )}
    >
      {children}
      {required ? <span className="ml-1 text-rose-500">*</span> : null}
    </label>
  );
}

// ─── BuilderCountedInput ─────────────────────────────────────────────────────

interface CountedInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
}

export function BuilderCountedInput({
  value,
  onChange,
  maxLength,
  label,
  required = false,
  placeholder,
  className,
  inputClassName,
  labelClassName,
}: CountedInputProps) {
  return (
    <div className={cn("w-full space-y-1", className)}>
      {label ? (
        <BuilderLabel className={labelClassName} required={required}>
          {label}
        </BuilderLabel>
      ) : null}
      <div className="relative w-full">
        <Input
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            // Taller tap target on mobile, normal on md+
            "h-10 sm:h-9 w-full pr-14 text-[11px] font-medium",
            inputClassName,
          )}
        />
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] font-bold text-slate-500">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

// ─── BuilderCountedTextarea ──────────────────────────────────────────────────

interface CountedTextareaProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  textareaClassName?: string;
}

export function BuilderCountedTextarea({
  value,
  onChange,
  maxLength,
  label,
  required = false,
  placeholder,
  className,
  textareaClassName,
}: CountedTextareaProps) {
  return (
    <div className={cn("w-full space-y-1", className)}>
      {label ? <BuilderLabel required={required}>{label}</BuilderLabel> : null}
      <div className="relative w-full">
        <Textarea
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "min-h-[4.5rem] sm:min-h-16 w-full pb-6 text-[11px] font-medium leading-4",
            textareaClassName,
          )}
        />
        <span className="pointer-events-none absolute bottom-1.5 right-2.5 text-[8px] font-bold text-slate-500">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

// ─── BuilderSegmentedControl ─────────────────────────────────────────────────

interface SegmentedOption<T extends string> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

interface BuilderSegmentedControlProps<T extends string> {
  value: T;
  options: Array<SegmentedOption<T>>;
  onChange: (value: T) => void;
  label?: string;
  className?: string;
  /**
   * "wrap"  – buttons wrap to the next row when space is tight (default)
   * "grid"  – buttons fill a uniform grid; each option gets equal width
   * "scroll" – single row, horizontally scrollable (good for many options)
   */
  layout?: "wrap" | "grid" | "scroll";
}

export function BuilderSegmentedControl<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
  layout = "wrap",
}: BuilderSegmentedControlProps<T>) {
  const containerClass = {
    wrap: "flex flex-wrap gap-2",
    grid: "grid gap-2",
    scroll: "flex gap-2 overflow-x-auto pb-1 scrollbar-none",
  }[layout];

  // For grid layout derive columns: ≤3 options → fill equally; 4+ → 2 cols on mobile, 3 on sm+
  const gridCols =
    layout === "grid"
      ? options.length <= 3
        ? `grid-cols-${options.length}`
        : "grid-cols-2 sm:grid-cols-3"
      : "";

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label ? <BuilderLabel>{label}</BuilderLabel> : null}

      <div className={cn(containerClass, gridCols)}>
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "inline-flex h-8 items-center justify-center rounded-[var(--vendor-radius-control)] border px-4 box-border",
                "text-[10px] font-bold transition",
                layout === "wrap" && "min-w-[5.5rem] flex-1 sm:flex-none",
                layout === "grid" && "w-full min-w-0",
                layout === "scroll" && "shrink-0 min-w-[5.5rem]",
                active
                  ? "border-[var(--vendor-primary-btn)] bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]"
                  : "border-[var(--vendor-border)] text-slate-600 hover:bg-slate-50",
              )}
            >
              {option.icon ? (
                <span className="mr-1.5 flex items-center">{option.icon}</span>
              ) : (
                <span
                  className={cn(
                    "mr-2 h-3 w-3 shrink-0 rounded-full border",
                    active
                      ? "border-[var(--vendor-primary-btn)] bg-[var(--vendor-primary-btn)]"
                      : "border-slate-300",
                  )}
                />
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── BuilderIconOptionGroup ──────────────────────────────────────────────────

interface BuilderIconOption<T extends string> {
  value: T;
  label: string;
  icon: React.ReactNode;
}

interface BuilderIconOptionGroupProps<T extends string> {
  value: T;
  options: Array<BuilderIconOption<T>>;
  onChange: (value: T) => void;
  className?: string;
  optionClassName?: string;
  /**
   * "auto"  – Tailwind auto-fills columns with min 64px cells (default)
   * "2"     – force 2 columns always
   * "3"     – 2 cols on mobile, 3 on sm+
   * "4"     – 2 cols on mobile, 4 on sm+
   * "5"     – 3 cols on mobile, 5 on sm+
   */
  columns?: "auto" | "2" | "3" | "4" | "5";
}

export function BuilderIconOptionGroup<T extends string>({
  value,
  options,
  onChange,
  className,
  optionClassName,
  columns = "auto",
}: BuilderIconOptionGroupProps<T>) {
  const gridClass = {
    auto: "grid grid-cols-[repeat(auto-fill,minmax(52px,1fr))]",
    "2": "grid grid-cols-2",
    "3": "grid grid-cols-2 sm:grid-cols-3",
    "4": "grid grid-cols-2 sm:grid-cols-4",
    "5": "grid grid-cols-3 sm:grid-cols-5",
  }[columns];

  return (
    <div className={cn(gridClass, "gap-2", className)}>
      {options.map((option) => {
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              // Fluid card: icon centred, label below, equal height via aspect or min-h
              "flex w-full flex-col items-center gap-1.5 rounded-[var(--vendor-radius-control)] border",
              "px-1.5 py-1.5",
              "text-[9px] font-medium transition-colors",
              "min-h-0",
              // Touch-friendly: slightly larger tap area on mobile
              active
                ? "border-[var(--vendor-primary-btn)] bg-[var(--vendor-primary-btn)]/8 text-[var(--vendor-primary-btn)]"
                : "border-[var(--vendor-border)] bg-white text-slate-500 hover:border-slate-300",
              optionClassName,
            )}
          >
            <span className="flex items-center justify-center">
              {option.icon}
            </span>
            <span className="text-center leading-tight">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
