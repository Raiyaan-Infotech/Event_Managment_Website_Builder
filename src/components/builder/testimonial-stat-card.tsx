// _components/testimonial-stat-card.tsx
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialStatCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  value: string | number;
  label: string;
  className?: string;
}

export function TestimonialStatCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  className,
}: TestimonialStatCardProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-slate-50/80 px-2 py-2",
        className,
      )}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ background: iconBg, color: iconColor }}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-[14px] font-black leading-none text-[var(--vendor-text)]">
          {value}
        </p>
        <p className="mt-0.5 truncate text-[9px] font-semibold leading-none text-[var(--vendor-text-muted)]">
          {label}
        </p>
      </div>
    </div>
  );
}