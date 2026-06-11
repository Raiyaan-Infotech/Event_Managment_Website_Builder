"use client";

import * as React from "react";
import { CloudUpload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string | null;
  label?: string;
  title?: string;
  browseText?: string;
  hint?: string;
  recommendedSize?: string;
  thumbnailAlt?: string;
  accept?: string;
  disabled?: boolean;
  compact?: boolean;
  size?: "sm" | "md" | "wide";
  className?: string;
  dropzoneClassName?: string;
  previewClassName?: string;
  inputId?: string;
  onFileSelect?: (file: File) => void;
  onRemove?: () => void;
}

export function ImageUpload({
  value,
  label,
  title = "Click to upload",
  browseText = "or drag and drop",
  hint = "PNG, JPG, SVG",
  recommendedSize = "(Max: 2MB)",
  thumbnailAlt = "Uploaded image preview",
  accept = "image/png,image/jpeg,image/webp,image/svg+xml",
  disabled = false,
  compact = false,
  size = "sm",
  className,
  dropzoneClassName,
  previewClassName,
  inputId,
  onFileSelect,
  onRemove,
}: ImageUploadProps) {
  const generatedId = React.useId();
  const id = inputId ?? generatedId;
  const [isDragging, setIsDragging] = React.useState(false);
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);
  const previewSrc = value ?? localPreview;

  /**
   * Size classes:
   * - "wide" fills full width (used for logo/hero uploads that span the card)
   * - "md" is a square thumbnail (non-compact)
   * - "sm" is a smaller square (default)
   *
   * On mobile we relax heights slightly so the tap target is comfortable,
   * and "wide" always stays full-width regardless of compact mode.
   */
  const sizeClass =
    size === "wide"
      ? compact
        ? "h-14 sm:h-16 w-full"   // compact wide: slightly shorter
        : "h-24 sm:h-32 w-full"   // normal wide
      : size === "md" && !compact
        ? "h-[100px] w-[100px] sm:h-[112px] sm:w-[112px]"
        : compact
          ? "h-[48px] w-[68px] sm:h-[54px] sm:w-[76px]"
          : "h-[66px] w-[82px] sm:h-[74px] sm:w-[92px]";

  React.useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const selectFile = (file: File | undefined) => {
    if (!file || disabled) return;
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(URL.createObjectURL(file));
    onFileSelect?.(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(null);
    onRemove?.();
  };

  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <label
          className="text-[10px] font-semibold text-[var(--vendor-text)]"
          htmlFor={id}
        >
          {label}
        </label>
      ) : null}

      {previewSrc ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)]",
            sizeClass,
            previewClassName,
          )}
        >
          <img
            src={previewSrc}
            alt={thumbnailAlt}
            className="h-full w-full object-cover"
          />
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute right-1 top-1 bg-white/95 text-rose-500 hover:bg-white"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            // Core layout: vertically centered, dashed border, smooth transitions
            "flex cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[var(--vendor-radius-panel)] border border-dashed text-center transition-colors",
            // Padding: compact mode uses minimal padding, normal gets more breathing room
            compact ? "p-1" : "p-2",
            sizeClass,
            isDragging
              ? "border-[var(--vendor-primary-btn)] bg-[var(--vendor-primary-btn)]/5"
              : "border-[var(--vendor-primary-btn)]/35 bg-[var(--vendor-panel-bg)] hover:border-[var(--vendor-primary-btn)] hover:bg-[var(--vendor-primary-btn)]/5",
            disabled && "pointer-events-none opacity-50",
            dropzoneClassName,
          )}
        >
          <CloudUpload
            className={cn(
              compact ? "h-3 w-3" : "h-3.5 w-3.5 sm:h-4 sm:w-4",
              "text-[var(--vendor-primary-btn)]",
            )}
          />

          <div>
            <p className="text-[8.5px] font-black leading-tight text-[var(--vendor-primary-btn)] sm:text-[9px]">
              {title}
            </p>
            {/* browseText only in non-compact, non-tiny dropzones */}
            {browseText && !compact ? (
              <p className="mt-0.5 text-[7.5px] font-medium leading-tight text-[var(--vendor-text-muted)] sm:text-[8px]">
                {browseText}
              </p>
            ) : null}
          </div>

          {/* hint + size only in non-compact mode */}
          {!compact && (
            <div>
              {hint ? (
                <p className="text-[7.5px] font-semibold leading-tight text-[var(--vendor-text-muted)] sm:text-[8px]">
                  {hint}
                </p>
              ) : null}
              {recommendedSize ? (
                <p className="text-[7.5px] font-semibold leading-tight text-[var(--vendor-text-muted)] sm:text-[8px]">
                  {recommendedSize}
                </p>
              ) : null}
            </div>
          )}

          <input
            id={id}
            type="file"
            accept={accept}
            className="sr-only"
            disabled={disabled}
            onChange={(event) => selectFile(event.target.files?.[0])}
          />
        </label>
      )}
    </div>
  );
}