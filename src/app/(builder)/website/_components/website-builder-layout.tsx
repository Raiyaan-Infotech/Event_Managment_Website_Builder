"use client";

import type * as React from "react";
import { HelpCircle, Save } from "lucide-react";
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
  preview: React.ReactNode;
  previewTitle?: string;
  previewSubtitle?: string;
  saveLabel?: string;
  howItWorksLabel?: string;
  onSave?: () => void;
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
}: WebsiteBuilderLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-full bg-[var(--vendor-page-bg)] px-5 py-5 lg:px-7",
        className,
      )}
    >
      <header className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-black tracking-tight text-[var(--vendor-text)]">
            {title}
          </h1>
          {breadcrumbs.length > 0 ? (
            <PageBreadcrumbs
              overrides={breadcrumbs}
              className="mt-2"
            />
          ) : (
            <PageBreadcrumbs className="mt-2" />
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {topActions}
          <OutlineButton
            type="button"
            size="sm"
            onClick={onHowItWorks}
            className="h-10 px-5"
          >
            <HelpCircle className="h-4 w-4" />
            {howItWorksLabel}
          </OutlineButton>
          <PrimaryButton
            type="button"
            size="sm"
            onClick={onSave}
            disabled={disableSave || isSaving}
            className="h-10 px-5 shadow-sm"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : saveLabel}
          </PrimaryButton>
        </div>
      </header>
      <div
        className={cn(
          "grid min-h-[calc(100vh-190px)] grid-cols-1 gap-3",
          sidebar
            ? "xl:grid-cols-[minmax(0,1fr)_minmax(0,0.55fr)]"
            : "xl:grid-cols-[minmax(560px,0.52fr)_minmax(0,1fr)]",
          contentClassName,
        )}
      >
        <aside
          className={cn(
            "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-5 shadow-sm",
            leftClassName,
          )}
        >
          {sidebar ? (
            <div className="flex min-h-full divide-x divide-[var(--vendor-border)]">
              <div className="min-w-0 flex-1 pr-5 space-y-4 overflow-auto">
                {form}
              </div>
              <div
                className={cn(
                  "w-[240px] shrink-0 pl-5 space-y-4",
                  sidebarClassName,
                )}
              >
                {sidebar}
              </div>
            </div>
          ) : (
            form
          )}
        </aside>

        {/* Preview col */}
        <section
          className={cn(
            "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-5 shadow-sm",
            rightClassName,
          )}
        >
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full bg-emerald-500"
                  aria-hidden="true"
                />
                <h2 className="text-[15px] font-black tracking-tight text-[var(--vendor-text)]">
                  {previewTitle}
                </h2>
              </div>
              {previewSubtitle ? (
                <p className="ml-5 mt-2 text-[13px] font-medium leading-5 text-[var(--vendor-text-muted)]">
                  {previewSubtitle}
                </p>
              ) : null}
            </div>
            {previewActions ? (
              <div className="shrink-0">{previewActions}</div>
            ) : null}
          </div>
          {preview}
        </section>
      </div>
    </div>
  );
}
