"use client";

import * as React from "react";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  inputPrefix?: React.ReactNode;
  showCount?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  autoFocus?: boolean;
  lockInput?: boolean;
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
  inputPrefix,
  showCount = true,
  onKeyDown,
  autoFocus = false,
  lockInput = false,
}: CountedInputProps) {
  return (
    <div className={cn("w-full space-y-1", className)}>
      {label ? (
        <BuilderLabel className={labelClassName} required={required}>
          {label}
        </BuilderLabel>
      ) : null}
      <div
        className={cn(
          "relative w-full",
          inputPrefix &&
            "flex h-8 overflow-hidden rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white sm:h-9",
        )}
      >
        {inputPrefix ? inputPrefix : null}
        <Input
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          className={cn(
            // h-8 on mobile (32px), h-9 on sm+ — fits the compact panel
            "h-8 sm:h-9 w-full text-[11px] font-medium",
            lockInput ? (showCount ? "!pr-16" : "!pr-8") : showCount ? "pr-12" : "pr-2",
            lockInput && "cursor-not-allowed bg-slate-50 text-slate-500",
            inputPrefix &&
              "h-full rounded-none border-0 shadow-none focus:border-transparent focus:ring-0",
            inputClassName,
          )}
          disabled={lockInput}
        />
        {lockInput ? (
          <Lock className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
        ) : null}
        {/* Character counter — stays inside the input on the right */}
        {showCount ? (
          <span
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 text-[8px] font-bold text-slate-400 tabular-nums",
              lockInput ? "right-7" : "right-2",
            )}
          >
            {value.length}/{maxLength}
          </span>
        ) : null}
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
            // Slightly taller on mobile for comfortable typing
  "min-h-[6rem] sm:min-h-[8rem] w-full pb-5 resize-y text-[11px] font-medium leading-4",
            textareaClassName,
          )}
        />
        {/* Counter anchored to bottom-right of textarea */}
        <span className="pointer-events-none absolute bottom-1.5 right-2 text-[8px] font-bold text-slate-400 tabular-nums">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

// ─── BuilderSegmentedControl ─────────────────────────────────────────────────

interface BuilderSelectOption<T extends string> {
  label: string;
  value: T;
}

interface BuilderSelectFieldProps<T extends string> {
  value: T;
  options: Array<BuilderSelectOption<T>>;
  onChange: (value: T) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
}

export function BuilderSelectField<T extends string>({
  value,
  options,
  onChange,
  label,
  placeholder,
  className,
  triggerClassName,
}: BuilderSelectFieldProps<T>) {
  return (
    <div className={cn("w-full space-y-1", className)}>
      {label ? <BuilderLabel>{label}</BuilderLabel> : null}
      <Select value={value} onValueChange={(nextValue) => onChange(nextValue as T)}>
        <SelectTrigger
          className={cn(
            "h-8 sm:h-9 w-full px-2 text-[10px] font-semibold",
            triggerClassName,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="!text-[11px]">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

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
   * "wrap"   – buttons wrap to the next row when space is tight (default)
   * "grid"   – buttons fill a uniform grid; each option gets equal width
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
    wrap: "flex flex-wrap gap-1.5",
    grid: "grid gap-1.5",
    scroll: "flex gap-1.5 overflow-x-auto pb-1 scrollbar-none",
  }[layout];

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
                // h-8 everywhere; min-w keeps labels readable on mobile
                "inline-flex h-8 items-center justify-center rounded-[var(--vendor-radius-control)] border px-3 box-border",
                "text-[10px] font-bold transition",
                layout === "wrap" && "min-w-[4.5rem] flex-1 sm:flex-none sm:min-w-[5.5rem]",
                layout === "grid" && "w-full min-w-0",
                layout === "scroll" && "shrink-0 min-w-[4.5rem]",
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
                    "mr-1.5 h-2.5 w-2.5 shrink-0 rounded-full border",
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
   * "auto" – auto-fills columns with min 52px cells (default)
   * "2"    – force 2 columns always
   * "3"    – 2 cols on mobile, 3 on sm+
   * "4"    – 2 cols on mobile, 4 on sm+
   * "5"    – 2 cols on mobile, 5 on sm+
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
    "5": "grid grid-cols-2 sm:grid-cols-5",
  }[columns];

  return (
    <div className={cn(gridClass, "min-w-0 gap-1.5 sm:gap-2", className)}>
      {options.map((option) => {
        const active = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "flex w-full flex-col items-center gap-1 rounded-[var(--vendor-radius-control)] border",
              // Slightly more padding on mobile for easier tapping
              "px-1 py-1.5 sm:px-1.5 sm:py-1.5",
              "text-[9px] font-medium transition-colors",
              // Ensure tap target is at least 36px tall
              "min-h-[36px]",
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
