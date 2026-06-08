"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Switch({
  checked = false,
  onCheckedChange,
  disabled,
  className,
  ...props
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-slate-300 transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-[var(--color-primary)]/10 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[var(--color-primary)]",
        className,
      )}
      {...props}
    >
      <span
        data-state={checked ? "checked" : "unchecked"}
        className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition duration-150 ease-in-out data-[state=checked]:translate-x-[18px]"
      />
    </button>
  );
}
