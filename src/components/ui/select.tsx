"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  disabled?: boolean;
  value?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onValueChange?: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelect() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used inside Select");
  }
  return context;
}

interface SelectProps {
  value?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Select({ value, disabled, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{ value, disabled, open, setOpen, onValueChange }}>
      <div className="relative w-full flex">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { disabled, open, setOpen } = useSelect();

  return (
    <button
      type="button"
      disabled={disabled}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-9 w-fit items-center justify-between gap-2 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] px-3 text-[var(--vendor-form-input-text)] font-semibold text-[var(--vendor-text)] shadow-xs outline-none transition focus:border-[var(--vendor-primary-btn)] focus:ring-4 focus:ring-[var(--vendor-primary-btn)]/10 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-3.5 w-3.5 text-[var(--vendor-text-muted)]" />
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = useSelect();

  return (
    <span className="line-clamp-1">
      {value || placeholder}
    </span>
  );
}

export function SelectContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open } = useSelect();

  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute left-0 top-[calc(100%+0.25rem)] z-50 min-w-full overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-1 text-[var(--vendor-text)] shadow-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { setOpen, onValueChange } = useSelect();

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-[var(--vendor-radius-control)] px-2 py-1.5 text-left text-[var(--vendor-form-input-text)] font-semibold hover:bg-[var(--vendor-table-row-hover)] hover:text-[var(--vendor-primary-btn)]",
        className,
      )}
      onClick={() => {
        onValueChange?.(value);
        setOpen(false);
      }}
    >
      <span className="line-clamp-1 text-[14px]">{children}</span>
      <Check className="h-3.5 w-3.5 opacity-0" />
    </button>
  );
}

export function SelectGroup({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function SelectLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-2 py-1.5 text-[var(--vendor-caption-text)] font-bold uppercase tracking-wide text-[var(--vendor-text-muted)]", className)}
      {...props}
    />
  );
}

export function SelectSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("-mx-1 my-1 h-px bg-[var(--vendor-border)]", className)} {...props} />;
}

export function SelectScrollUpButton() {
  return null;
}

export function SelectScrollDownButton() {
  return null;
}
