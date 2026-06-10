"use client";

import type * as React from "react";
import { Eye, HelpCircle, Save } from "lucide-react";
import { OutlineButton, PrimaryButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageBreadcrumbs } from "./page-breadcrumbs";

export interface WebsiteBuilderBreadcrumbItem {
  label: string;
  href?: string;
}

interface WebsiteBuilderLayoutProps {
  title: string;
  breadcrumbs?: WebsiteBuilderBreadcrumbItem[];
  form: React.ReactNode;
  preview?: React.ReactNode;
  previewTitle?: string;
  previewSubtitle?: string;
  saveLabel?: string;
  howItWorksLabel?: string;
  onSave?: () => void;
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
}

export function WebsiteBuilderLayout({
  title,
  breadcrumbs = [],
  form,
  preview,
  previewTitle = "Live Preview",
  previewSubtitle,
  saveLabel = "Save Changes",
  howItWorksLabel = "How It Works",
  onSave,
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
}: WebsiteBuilderLayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden bg-[var(--vendor-page-bg)] px-3 py-1.5",
        "h-full",
        className,
      )}
    >
      {!hideHeader && (
        <header className="mb-1.5 flex shrink-0 flex-col gap-1.5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-[15px] font-black leading-5 text-[var(--vendor-text)]">
              {title}
            </h1>
            {breadcrumbs.length > 0 ? (
              <PageBreadcrumbs overrides={breadcrumbs} className="mt-0.5" />
            ) : (
              <PageBreadcrumbs className="mt-0.5" />
            )}
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {topActions}
            <OutlineButton
              type="button"
              size="sm"
              onClick={
                onPreview ||
                (() => window.open("/website/preview-publish", "_blank"))
              }
              className="h-8 px-3 text-[12px] gap-1.5"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </OutlineButton>
            {onHowItWorks && (
              <OutlineButton
                type="button"
                size="sm"
                onClick={onHowItWorks}
                className="h-8 px-3 text-[12px]"
              >
                <HelpCircle className="h-4 w-4" />
                {howItWorksLabel}
              </OutlineButton>
            )}
            <PrimaryButton
              type="button"
              size="sm"
              onClick={onSave}
              disabled={disableSave || isSaving}
              className="h-8 px-3 text-[12px] shadow-sm"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : saveLabel}
            </PrimaryButton>
          </div>
        </header>
      )}
      <div
        className={cn(
          "grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden",
          sidebar
            ? "xl:grid-cols-[minmax(0,1fr)_minmax(240px,280px)]"
            : "grid-cols-1",
          contentClassName,
        )}
      >
        <aside
          className={cn(
            "flex h-full max-h-full flex-col overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] shadow-sm website-builder-form-panel",
            leftClassName,
          )}
        >
<div className="builder-form-scroll min-h-0 flex-1 overflow-y-auto p-3 h-full">
            {form}
          </div>
        </aside>
        {sidebar ? (
          <aside
            className={cn(
              "flex h-full max-h-full flex-col overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] shadow-sm website-builder-sidebar-panel",
              sidebarClassName,
            )}
          >
            <div className="min-h-0 flex-1 overflow-y-auto p-3">{sidebar}</div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
