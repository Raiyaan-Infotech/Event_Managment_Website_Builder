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
    <Card className="flex h-[76px] items-center gap-2.5 px-3 py-2 transition duration-150 ease-in-out hover:shadow-[var(--shadow-card-hover)]">
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-input)]", tones[tone])}>
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium leading-4 tracking-[-0.01em] text-[var(--color-text-secondary)]">
          {title}
        </p>
        <p className="mt-0.5 text-[18px] font-bold leading-6 tracking-[-0.03em] text-[var(--color-text)]">
          {value}
        </p>
        <p className="mt-0.5 text-[10px] font-medium leading-3 text-[var(--color-success)]">
          up {growth} this month
        </p>
      </div>
    </Card>
  );
}
