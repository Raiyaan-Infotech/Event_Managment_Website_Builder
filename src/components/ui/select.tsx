"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  disabled?: boolean;
  value?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onValueChange?: (value: string) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
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
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <SelectContext.Provider value={{ value, disabled, open, setOpen, onValueChange, triggerRef }}>
      <div className="relative flex w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { disabled, open, setOpen, triggerRef } = useSelect();

  return (
    <button
      ref={triggerRef}
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
  const { open, setOpen, triggerRef } = useSelect();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  // Position the dropdown via fixed coordinates from the trigger so it escapes
  // any `overflow` ancestor (e.g. scrollable tables) instead of being clipped.
  React.useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, triggerRef]);

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, setOpen, triggerRef]);

  if (!open || !rect || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={contentRef}
      style={{
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        minWidth: rect.width,
        zIndex: 1000,
      }}
      className={cn(
        "max-h-[260px] overflow-auto rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-1 text-[var(--vendor-text)] shadow-lg",
        className,
      )}
    >
      {children}
    </div>,
    document.body,
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
      <span className="line-clamp-1 text-[12px]">{children}</span>
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
