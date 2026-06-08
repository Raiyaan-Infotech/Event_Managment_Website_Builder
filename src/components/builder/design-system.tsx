import * as React from "react";
import { UploadCloud } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export { PrimaryButton, OutlineButton } from "@/components/ui/button";

type BadgeStatus = "draft" | "published" | "pending" | "rejected" | "default";

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div>
        <h1 className="text-[32px] font-bold leading-tight tracking-[-0.03em] text-[var(--color-text)]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-[14px] font-normal leading-5 text-[var(--color-text-secondary)]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className={cn("p-4", contentClassName)}>
        {(title || description || actions) ? (
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              {title ? (
                <h2 className="text-[22px] font-semibold leading-7 tracking-[-0.02em] text-[var(--color-text)]">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p className="mt-1 text-[14px] font-normal leading-5 text-[var(--color-text-secondary)]">
                  {description}
                </p>
              ) : null}
            </div>
            {actions}
          </div>
        ) : null}
        {children}
      </CardContent>
    </Card>
  );
}

export function PreviewCard({
  title = "Live Preview",
  description,
  actions,
  children,
  className,
  contentClassName,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <SectionCard
      className={className}
      contentClassName={cn("p-6", contentClassName)}
      actions={actions}
      title={title}
      description={description}
    >
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" />
        <span className="sr-only">Live preview is active</span>
      </div>
      {children}
    </SectionCard>
  );
}

function FieldLabel({
  label,
  required,
}: {
  label?: string;
  required?: boolean;
}) {
  if (!label) return null;
  return (
    <label className="text-[14px] font-medium leading-5 tracking-[-0.01em] text-[var(--color-text)]">
      {label}
      {required ? <span className="ml-1 text-[var(--color-danger)]">*</span> : null}
    </label>
  );
}

export function FormInput({
  label,
  helper,
  error,
  required,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <FieldLabel label={label} required={required} />
      <Input {...props} required={required} />
      {helper ? <p className="text-[12px] font-medium text-[var(--color-text-secondary)]">{helper}</p> : null}
      {error ? <p className="text-[12px] font-medium text-[var(--color-danger)]">{error}</p> : null}
    </div>
  );
}

export function FormSelect({
  label,
  helper,
  error,
  required,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  helper?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <FieldLabel label={label} required={required} />
      <select
        className="h-11 w-full rounded-[var(--radius-input)] border border-[var(--color-border)] bg-white px-3 text-[14px] font-normal text-[var(--color-text)] outline-none transition duration-150 ease-in-out focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10"
        required={required}
        {...props}
      >
        {children}
      </select>
      {helper ? <p className="text-[12px] font-medium text-[var(--color-text-secondary)]">{helper}</p> : null}
      {error ? <p className="text-[12px] font-medium text-[var(--color-danger)]">{error}</p> : null}
    </div>
  );
}

export function FormTextarea({
  label,
  helper,
  error,
  required,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  helper?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <FieldLabel label={label} required={required} />
      <Textarea {...props} required={required} />
      {helper ? <p className="text-[12px] font-medium text-[var(--color-text-secondary)]">{helper}</p> : null}
      {error ? <p className="text-[12px] font-medium text-[var(--color-danger)]">{error}</p> : null}
    </div>
  );
}

export function UploadBox({
  title = "Click to upload",
  description = "or drag and drop",
  hint,
  compact,
  className,
}: {
  title?: string;
  description?: string;
  hint?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full flex-col items-center justify-center rounded-[var(--radius-input)] border border-dashed border-[var(--color-accent)]/45 bg-white text-center transition duration-150 ease-in-out hover:bg-blue-50/40",
        compact ? "min-h-[104px] p-4" : "min-h-[160px] p-6",
        className,
      )}
    >
      <UploadCloud className="h-8 w-8 text-[var(--color-accent)]" />
      <span className="mt-3 text-[14px] font-semibold text-[var(--color-primary)]">{title}</span>
      <span className="mt-1 text-[13px] font-normal text-[var(--color-text-secondary)]">{description}</span>
      {hint ? <span className="mt-2 text-[12px] font-medium text-[var(--color-text)]">{hint}</span> : null}
    </button>
  );
}

export function ActionButton({
  icon: Icon,
  children,
  ...props
}: React.ComponentProps<typeof Button> & { icon?: LucideIcon }) {
  return (
    <Button {...props}>
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </Button>
  );
}

export function StatusBadge({
  status = "default",
  children,
  className,
}: {
  status?: BadgeStatus;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Badge status={status} className={cn("font-medium", className)}>
      {children}
    </Badge>
  );
}

export function SettingsLayout({
  left,
  right,
  className,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-[minmax(360px,420px)_minmax(0,1fr)]", className)}>
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
