"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
import { OutlineButton, PrimaryButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageBreadcrumbs } from "./page-breadcrumbs";
import {
  DesktopMobileToggle,
  type PreviewDevice,
} from "./desktop-mobile-toggle";

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
  previewHeaderAction?: React.ReactNode;
  previewDevice?: PreviewDevice;
  onPreviewDeviceChange?: (device: PreviewDevice) => void;
  previewActions?: React.ReactNode;
  leftClassName?: string;
  rightClassName?: string;
  contentClassName?: string;
  className?: string;
  sidebar?: React.ReactNode;
  sidebarClassName?: string;
  hideHeader?: boolean;
  primaryButton?: WebsiteBuilderPrimaryButtonProps;
  previewTip?: string;
}

export function WebsiteBuilderLayout({
  title,
  breadcrumbs = [],
  form,
  preview,
  previewTitle = "Live Preview",
  previewSubtitle = "This is how your section will appear on your website.",
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
  previewHeaderAction,
  previewDevice: previewDeviceProp,
  onPreviewDeviceChange,
  previewActions,
  leftClassName,
  rightClassName,
  contentClassName,
  className,
  sidebar,
  sidebarClassName,
  hideHeader = false,
  primaryButton,
  previewTip = "Changes you make on the left will reflect in the live preview instantly.",
}: WebsiteBuilderLayoutProps) {
  const [internalDevice, setInternalDevice] = React.useState<PreviewDevice>("desktop");
  const activeDevice = previewDeviceProp ?? internalDevice;
  const handleDeviceChange = (d: PreviewDevice) => {
    setInternalDevice(d);
    onPreviewDeviceChange?.(d);
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden bg-[var(--vendor-page-bg)]",
        "px-2 py-1.5 sm:px-3",
        "h-full",
        className,
      )}
    >
      {!hideHeader && (
        <header className="mb-1.5 flex shrink-0 items-center justify-between gap-3">
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
          "grid min-h-0 min-w-0 flex-1 gap-2 overflow-hidden",
          preview
            ? [
                // Mobile/tablet: stack vertically; each panel gets natural height
                "grid-cols-1",
                // Desktop: side-by-side, form slightly narrower than preview
                "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]",
                // On small screens the two panels stack — give each a fixed max-height
                // so neither swallows the viewport
                "max-lg:[&>*]:max-h-[50vh]",
              ]
            : sidebar
              ? "grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(240px,280px)]"
              : "grid-cols-1",
          contentClassName,
        )}
      >
        {/* ── Form panel ─────────────────────────────────────────────── */}
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

        {/* ── Preview panel ──────────────────────────────────────────── */}
        {preview && (
          <aside
            className={cn(
              "flex h-full max-h-full min-w-0 max-w-full flex-col overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] shadow-sm website-builder-preview-panel",
              rightClassName,
            )}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--vendor-border)] px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <div className="min-w-0">
                  <p className="text-[12px] font-bold leading-tight text-[var(--vendor-text)] truncate">
                    {previewTitle}
                  </p>
                  {previewSubtitle && (
                    <p className="text-[10px] leading-tight text-[var(--vendor-text-muted)] truncate">
                      {previewSubtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                {previewHeaderAction ?? (
                  <DesktopMobileToggle
                    value={activeDevice}
                    onChange={handleDeviceChange}
                  />
                )}
              </div>
            </div>

            {/* Body — grey background like a real browser chrome, preview card centred */}
            <div className="relative min-h-0 flex-1 overflow-auto bg-[var(--vendor-page-bg)]">
              <div
                className={cn(
                  "min-h-full transition-all duration-300 ease-in-out",
                  activeDevice === "mobile"
                    ? // Mobile: narrow card, centred, with breathing room
                      "mx-auto w-[390px] max-w-full py-4 px-2"
                    : // Desktop: full width with a little padding
                      "w-full p-2",
                )}
              >
                {preview}
              </div>
            </div>

            {/* Tip bar */}
            {previewTip && (
              <div className="flex shrink-0 items-center gap-1.5 border-t border-[var(--vendor-border)] bg-[hsl(228_64%_97%)] px-3 py-1.5">
                <span className="text-[11px]">💡</span>
                <p className="text-[10px] text-[var(--vendor-text-muted)]">
                  <span className="font-bold text-[var(--vendor-text)]">Tip:</span>{" "}
                  {previewTip}
                </p>
              </div>
            )}
          </aside>
        )}

        {/* ── Legacy sidebar (only when no preview) ──────────────────── */}
        {!preview && sidebar && (
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
        )}
      </div>
    </div>
  );
}