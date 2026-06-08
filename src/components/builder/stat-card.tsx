import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  growth: string;
  icon: LucideIcon;
  tone?: "blue" | "purple" | "teal" | "green" | "orange";
}

const tones = {
  blue: "bg-blue-50 text-[var(--color-primary)]",
  purple: "bg-purple-50 text-[var(--color-accent)]",
  teal: "bg-cyan-50 text-[var(--color-info)]",
  green: "bg-green-50 text-[var(--color-success)]",
  orange: "bg-orange-50 text-[var(--color-warning)]",
};

export function StatCard({ title, value, growth, icon: Icon, tone = "blue" }: StatCardProps) {
  return (
    <Card className="flex h-[96px] items-center gap-3.5 p-4 transition duration-150 ease-in-out hover:shadow-[var(--shadow-card-hover)]">
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-input)]", tones[tone])}>
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[14px] font-medium leading-5 tracking-[-0.01em] text-[var(--color-text-secondary)]">
          {title}
        </p>
        <p className="mt-0.5 text-[24px] font-bold leading-7 tracking-[-0.03em] text-[var(--color-text)]">
          {value}
        </p>
        <p className="mt-0.5 text-[12px] font-medium leading-4 text-[var(--color-success)]">
          up {growth} this month
        </p>
      </div>
    </Card>
  );
}
