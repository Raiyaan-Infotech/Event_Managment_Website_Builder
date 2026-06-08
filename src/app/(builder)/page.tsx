import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Calendar,
  Check,
  ClipboardList,
  Copy,
  CreditCard,
  Eye,
  Headphones,
  ImageIcon,
  Monitor,
  Rocket,
  Settings,
  Users,
} from "lucide-react";
import { ActionButton, SectionCard, StatusBadge } from "@/components/builder/design-system";
import { StatCard } from "@/components/builder/stat-card";
import { Card } from "@/components/ui/card";

const steps = [
  ["Website Setup", "Completed"],
  ["Branding", "Completed"],
  ["Homepage", "Completed"],
  ["Services", "Completed"],
  ["Events", "Completed"],
  ["Content", "Completed"],
  ["Publish", "Pending"],
];

const quickActions: Array<[string, LucideIcon]> = [
  ["Edit Homepage", Monitor],
  ["Manage Services", Calendar],
  ["Add New Event", Calendar],
  ["View Enquiries", Monitor],
  ["Website Settings", Settings],
];

const activities: Array<[string, string, string, LucideIcon, "blue" | "purple" | "green"]> = [
  ["Homepage updated", "You updated the homepage content.", "2 hours ago", Monitor, "blue"],
  ["New gallery images added", "12 new images added to your gallery.", "5 hours ago", ImageIcon, "purple"],
  ["SEO settings updated", "Meta title and description updated.", "1 day ago", Settings, "green"],
];

const metricCards: Array<[string, string, string, LucideIcon, "blue" | "purple" | "orange" | "green"]> = [
  ["Website Visitors", "2,450", "24%", Users, "blue"],
  ["Page Views", "6,732", "32%", Eye, "purple"],
  ["Enquiries", "312", "18%", ClipboardList, "orange"],
  ["Conversion Rate", "12.7%", "8%", BarChart3, "green"],
];

const toneClasses = {
  blue: "bg-blue-50 text-[var(--color-primary)]",
  purple: "bg-purple-50 text-[var(--color-accent)]",
  orange: "bg-orange-50 text-[var(--color-warning)]",
  green: "bg-green-50 text-[var(--color-success)]",
};

function SetupProgress() {
  return (
    <SectionCard contentClassName="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[18px] font-semibold leading-6 tracking-[-0.02em] text-[var(--color-text)]">
            Website Setup Progress
          </h2>
          <p className="mt-0.5 text-[13px] font-normal leading-5 text-[var(--color-text-secondary)]">
            Complete all steps to publish your website
          </p>
        </div>
        <p className="text-[28px] font-bold leading-8 tracking-[-0.04em] text-[var(--color-primary)]">85%</p>
      </div>

      <div className="mt-3.5 h-2 rounded-full bg-blue-50">
        <div className="h-full w-[85%] rounded-full bg-[var(--color-primary)]" />
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {steps.map(([label, status], index) => {
          const done = status === "Completed";
          return (
            <div key={label} className="relative text-center">
              {index < steps.length - 1 ? (
                <div className="absolute left-1/2 top-[18px] h-px w-full border-t border-dashed border-blue-200" />
              ) : null}
              <div
                className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-full ${
                  done ? "bg-green-100 text-[var(--color-success)]" : "bg-[var(--color-primary)] text-white"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : <Rocket className="h-4 w-4" />}
              </div>
              <p className="mt-2 truncate text-[12px] font-semibold leading-4 text-[var(--color-text)]">{label}</p>
              <p className={done ? "mt-1 text-[12px] font-medium text-[var(--color-success)]" : "mt-1 text-[12px] font-medium text-[var(--color-text-secondary)]"}>
                {status}
              </p>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function AnalyticsChart() {
  const yAxisLabels = ["2K", "1.5K", "1K", "500", "0"];
  const xAxisLabels = ["Apr 20", "Apr 27", "May 4", "May 11", "May 18"];

  return (
    <SectionCard
      title="Website Analytics"
      actions={<ActionButton variant="outline" className="h-9 px-4 text-[13px]">Last 30 Days</ActionButton>}
      contentClassName="p-4"
    >
      <div className="grid items-center gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="grid h-[210px] grid-cols-2 gap-3">
          {metricCards.map(([label, value, growth, Icon, tone]) => (
            <Card key={label} className="flex h-full items-center p-3.5">
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-input)] ${toneClasses[tone]}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <p className="text-[12px] font-medium leading-4 text-[var(--color-text-secondary)]">{label}</p>
                  <p className="mt-0.5 text-[17px] font-bold leading-5 tracking-[-0.02em]">{value}</p>
                  <p className="text-[12px] font-medium text-[var(--color-success)]">up {growth}</p>
                </span>
              </div>
            </Card>
          ))}
        </div>

        <div className="min-w-0 rounded-[var(--radius-card)] bg-gradient-to-b from-blue-50 to-purple-50 p-4">
          <div className="grid h-[210px] grid-cols-[40px_minmax(0,1fr)] grid-rows-[1fr_24px]">
            <div className="flex flex-col justify-between pb-6 pr-3 text-right text-[12px] font-medium text-[var(--color-text-secondary)]">
              {yAxisLabels.map((label) => <span key={label}>{label}</span>)}
            </div>
            <div className="min-w-0 overflow-hidden">
              <svg viewBox="0 0 680 240" preserveAspectRatio="none" className="h-full w-full">
                <defs>
                  <linearGradient id="areaBlue" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.24" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.03" />
                  </linearGradient>
                  <linearGradient id="areaPurple" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.03" />
                  </linearGradient>
                </defs>
                {[16, 64, 112, 160, 208].map((y) => (
                  <line key={y} x1="0" x2="680" y1={y} y2={y} stroke="#E2E8F0" />
                ))}
                <path d="M0 165 C58 148 80 95 128 90 C174 85 176 165 228 151 C280 136 276 90 326 96 C378 102 368 54 424 72 C478 92 470 130 530 110 C584 90 594 16 680 42" fill="none" stroke="#2563EB" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                <path d="M0 165 C58 148 80 95 128 90 C174 85 176 165 228 151 C280 136 276 90 326 96 C378 102 368 54 424 72 C478 92 470 130 530 110 C584 90 594 16 680 42 L680 220 L0 220 Z" fill="url(#areaBlue)" />
                <path d="M0 198 C58 178 82 138 128 140 C178 142 180 176 230 158 C282 140 280 126 332 122 C384 118 378 98 430 114 C482 130 474 144 532 132 C586 118 596 86 680 94" fill="none" stroke="#7C3AED" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                <path d="M0 198 C58 178 82 138 128 140 C178 142 180 176 230 158 C282 140 280 126 332 122 C384 118 378 98 430 114 C482 130 474 144 532 132 C586 118 596 86 680 94 L680 220 L0 220 Z" fill="url(#areaPurple)" />
              </svg>
            </div>
            <div />
            <div className="flex items-end justify-between text-[12px] font-medium text-[var(--color-text-secondary)]">
              {xAxisLabels.map((label) => <span key={label}>{label}</span>)}
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function StatusPanel() {
  return (
    <SectionCard contentClassName="p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold leading-6 tracking-[-0.02em]">Website Status</h2>
        <StatusBadge status="draft">Draft</StatusBadge>
      </div>
      <p className="mt-2.5 text-[13px] font-normal leading-5 text-[var(--color-text-secondary)]">
        Your website is in draft mode. Publish your website to make it live.
      </p>

      <h3 className="mt-4 text-[13px] font-semibold leading-5">Website URL</h3>
      <div className="relative mt-2 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-slate-50 py-2.5 pl-4 pr-12 text-[13px] font-semibold">
        raj-events.eventcraft.com
        <button
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--color-primary)] hover:bg-blue-50"
          aria-label="Copy website URL"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-4">
        {[
          ["Visitors Today", "124"],
          ["Leads Generated", "12"],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="flex items-center gap-2 text-[12px] font-medium text-[var(--color-text-secondary)]">
              <Users className="h-4 w-4 text-[var(--color-primary)]" />
              {label}
            </p>
            <p className="mt-2 text-[24px] font-bold leading-7 tracking-[-0.03em]">{value}</p>
          </div>
        ))}
      </div>

      <ActionButton variant="outline" className="mt-4 h-10 w-full" icon={Eye}>
        Preview Website
      </ActionButton>
      <ActionButton className="mt-2.5 h-10 w-full" icon={Rocket}>
        Publish Website
      </ActionButton>
    </SectionCard>
  );
}

function QuickActions() {
  return (
    <SectionCard title="Quick Actions" contentClassName="p-4">
      <div className="space-y-1">
        {quickActions.map(([label, Icon]) => (
          <button
            key={label}
            className="flex h-10 w-full items-center justify-between rounded-[var(--radius-input)] px-2 text-left text-[14px] font-medium transition duration-150 ease-in-out hover:bg-slate-50"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-input)] bg-blue-50 text-[var(--color-primary)]">
                <Icon className="h-5 w-5" />
              </span>
              {label}
            </span>
            <span className="text-[var(--color-text-secondary)]">-&gt;</span>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

function RecentActivity() {
  return (
    <SectionCard title="Recent Activity" contentClassName="p-4">
      <div className="divide-y divide-[var(--color-border)]">
        {activities.map(([title, desc, time, Icon, tone]) => (
          <div key={title} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full ${toneClasses[tone]}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[14px] font-semibold leading-5 tracking-[-0.01em]">{title}</p>
                <p className="text-[12px] font-normal leading-4 text-[var(--color-text-secondary)]">{desc}</p>
              </div>
            </div>
            <p className="shrink-0 text-[12px] font-medium text-[var(--color-text-secondary)]">{time}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 text-center">
        <ActionButton variant="outline" className="h-9 min-w-40 text-[13px]">
          View All Activity
        </ActionButton>
      </div>
    </SectionCard>
  );
}

function NeedHelpCard() {
  return (
    <SectionCard contentClassName="flex items-center gap-3 p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[var(--color-primary)]">
        <Headphones className="h-6 w-6" />
      </div>
      <div>
        <h2 className="text-[18px] font-semibold leading-6 tracking-[-0.02em]">Need Help?</h2>
        <p className="mt-1.5 text-[12px] font-normal leading-5 text-[var(--color-text-secondary)]">
          Check our documentation or contact our support team.
        </p>
        <p className="mt-3 text-[13px] font-semibold text-[var(--color-primary)]">Visit Help Center -&gt;</p>
      </div>
    </SectionCard>
  );
}

export default function DashboardPage() {
  return (
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Bookings" value="48" growth="18%" icon={Calendar} />
            <StatCard title="Leads" value="126" growth="22%" icon={Users} tone="purple" />
            <StatCard title="Customers" value="89" growth="15%" icon={Users} tone="teal" />
            <StatCard title="Total Revenue" value="Rs.6,48,000" growth="20%" icon={CreditCard} tone="green" />
          </div>
          <SetupProgress />
          <AnalyticsChart />
          <RecentActivity />
        </div>

        <div className="w-full space-y-3 xl:w-[320px]">
          <StatusPanel />
          <QuickActions />
          <NeedHelpCard />
        </div>
      </div>
  );
}
