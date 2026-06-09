import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "destructive"
  | "link";

export type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function buttonClassName({
  variant = "primary",
  size = "default",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--button-radius)] font-semibold tracking-[-0.01em] transition duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-[var(--button-primary-bg)]/10 disabled:pointer-events-none disabled:opacity-60",
    size === "default" && "h-[var(--button-height)] px-4 text-[var(--button-text-size)]",
    size === "xs" && "h-7 rounded-lg px-2 text-[12px]",
    size === "sm" && "h-9 px-3 text-[13px]",
    size === "lg" && "h-[var(--button-height)] px-6 text-[var(--button-text-size)]",
    size === "icon" && "h-9 w-9 p-0",
    size === "icon-xs" && "h-7 w-7 rounded-lg p-0",
    size === "icon-sm" && "h-8 w-8 rounded-lg p-0",
    size === "icon-lg" && "h-[var(--button-height)] w-[var(--button-height)] p-0",
    (variant === "default" || variant === "primary") &&
      "bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] shadow-sm hover:bg-[var(--button-primary-hover)]",
    variant === "secondary" &&
      "border border-[var(--button-primary-bg)] bg-white text-[var(--button-primary-bg)] shadow-sm hover:bg-blue-50",
    variant === "outline" &&
      "border border-[var(--button-outline-border)] bg-[var(--button-outline-bg)] text-[var(--button-outline-text)] shadow-sm hover:bg-[var(--button-outline-hover-bg)]",
    variant === "ghost" && "text-slate-600 hover:bg-slate-100",
    (variant === "danger" || variant === "destructive") &&
      "bg-[var(--color-danger)] text-white shadow-sm hover:bg-red-600",
    variant === "link" &&
      "h-auto rounded-none px-0 text-[var(--button-primary-bg)] underline-offset-4 hover:underline",
    className,
  );
}

export function Button({ className, variant = "primary", size = "default", ...props }: ButtonProps) {
  return (
    <button
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  );
}

export function PrimaryButton(props: Omit<ButtonProps, "variant">) {
  return <Button {...props} variant="primary"  />;
}

export function OutlineButton(props: Omit<ButtonProps, "variant">) {
  return <Button {...props} variant="outline" />;
}
