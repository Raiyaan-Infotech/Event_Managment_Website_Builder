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
        "relative inline-flex h-6 w-14 shrink-0 items-center rounded-full bg-rose-500 transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-emerald-500",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none absolute left-1.5 text-[8px] font-bold uppercase tracking-wide text-white transition-opacity",
          checked ? "opacity-100" : "opacity-0",
        )}
      >
        On
      </span>
      <span
        className={cn(
          "pointer-events-none absolute right-1.5 text-[8px] font-bold uppercase tracking-wide text-white/90 transition-opacity",
          checked ? "opacity-0" : "opacity-100",
        )}
      >
        Off
      </span>
      <span
        data-state={checked ? "checked" : "unchecked"}
        className="pointer-events-none block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition duration-150 ease-in-out data-[state=checked]:translate-x-[2rem]"
      />
    </button>
  );
}
