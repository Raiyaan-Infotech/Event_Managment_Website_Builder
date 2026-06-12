"use client";

import type * as React from "react";
import { HelpCircle } from "lucide-react";
import { OutlineButton, PrimaryButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageBreadcrumbs } from "./page-breadcrumbs";

export interface WebsiteBuilderBreadcrumbItem {
  label: string;
  href?: string;
}

export interface WebsiteBuilderPrimaryButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

interface WebsiteBuilderLayoutProps {
  title: string;
  breadcrumbs?: WebsiteBuilderBreadcrumbItem[];
  form: React.ReactNode;
  preview?: React.ReactNode;
  previewTitle?: string;
  previewSubtitle?: string;
  saveLabel?: string;
  cancelLabel?: string;
  howItWorksLabel?: string;
  onSave?: () => void;
  onCancel?: () => void;
  onPreview?: () => void;
  onHowItWorks?: () => void;
  isSaving?: boolean;
  disableSave?: boolean;
  topActions?: React.ReactNode;
  previewActions?: React.ReactNode;
  leftClassName?: string;
  rightClassName?: string;
  contentClassName?: string;
  className?: string;
  sidebar?: React.ReactNode;
  sidebarClassName?: string;
  hideHeader?: boolean;
  /** Optional primary action button rendered in the header actions row */
  primaryButton?: WebsiteBuilderPrimaryButtonProps;
}

export function WebsiteBuilderLayout({
  title,
  breadcrumbs = [],
  form,
  previewTitle = "Live Preview",
  previewSubtitle,
  saveLabel = "Save Changes",
  cancelLabel = "Cancel",
  howItWorksLabel = "How It Works",
  onSave,
  onCancel,
  onPreview,
  onHowItWorks,
  isSaving = false,
  disableSave = false,
  topActions,
  previewActions,
  leftClassName,
  rightClassName,
  contentClassName,
  className,
  sidebar,
  sidebarClassName,
  hideHeader = false,
  primaryButton,
}: WebsiteBuilderLayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden bg-[var(--vendor-page-bg)]",
        // Responsive padding: tighter on mobile, comfortable on desktop
        "px-2 py-1.5 sm:px-3",
        "h-full",
        className,
      )}
    >
      {!hideHeader && (
        <header className="mb-1.5 flex shrink-0 items-center justify-between gap-3">
          {/* Left — title + breadcrumbs */}
          <div className="min-w-0">
            <h1 className="text-[15px] font-black leading-5 text-[var(--vendor-text)] truncate">
              {title}
            </h1>
            {breadcrumbs.length > 0 ? (
              <PageBreadcrumbs overrides={breadcrumbs} className="mt-0.5" />
            ) : (
              <PageBreadcrumbs className="mt-0.5" />
            )}
          </div>

          {/* Right — action buttons */}
          <div className="flex shrink-0 items-center gap-1.5">
            {topActions}
            {onHowItWorks && (
              <OutlineButton
                type="button"
                size="sm"
                onClick={onHowItWorks}
                className="h-8 shrink-0 px-2.5 text-[11px] sm:px-3"
              >
                <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">{howItWorksLabel}</span>
              </OutlineButton>
            )}
            {primaryButton && (
              <PrimaryButton
                type="button"
                size="sm"
                onClick={primaryButton.onClick}
                disabled={primaryButton.disabled || primaryButton.isLoading}
                className="h-8 shrink-0 px-3 text-[11px]"
              >
                {primaryButton.isLoading ? "Loading…" : primaryButton.label}
              </PrimaryButton>
            )}
          </div>
        </header>
      )}

      <div
        className={cn(
          "grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-2 overflow-hidden",
          sidebar &&
            "xl:grid-cols-[minmax(0,1fr)_minmax(240px,280px)]",
          contentClassName,
        )}
      >
        {/* Main form panel */}
        <aside
          className={cn(
            "flex h-full max-h-full min-w-0 max-w-full flex-col overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] shadow-sm website-builder-form-panel",
            leftClassName,
          )}
        >
          <div className="builder-form-scroll h-full min-h-0 min-w-0 max-w-full flex-1 overflow-x-hidden overflow-y-auto p-2 sm:p-3">
            {form}
          </div>
        </aside>

        {/* Optional sidebar */}
        {sidebar ? (
          <aside
            className={cn(
              "flex h-full max-h-full min-w-0 max-w-full flex-col overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] shadow-sm website-builder-sidebar-panel",
              sidebarClassName,
            )}
          >
            <div className="min-h-0 flex-1 overflow-y-auto p-2 sm:p-3">
              {sidebar}
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}