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
  const sizeClass =
    size === "wide"
      ? "h-32 w-full"
      : size === "md" && !compact
        ? "h-[112px] w-[112px]"
        : compact
          ? "h-[54px] w-[76px]"
          : "h-[74px] w-[92px]";

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
        <label className="text-[10px] font-semibold text-[var(--vendor-text)]" htmlFor={id}>
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
          <img src={previewSrc} alt={thumbnailAlt} className="h-full w-full object-cover" />
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
            "flex cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[var(--vendor-radius-panel)] border border-dashed p-1 text-center transition-colors",
            sizeClass,
            isDragging
              ? "border-[var(--vendor-primary-btn)] bg-[var(--vendor-primary-btn)]/5"
              : "border-[var(--vendor-primary-btn)]/35 bg-[var(--vendor-panel-bg)] hover:border-[var(--vendor-primary-btn)] hover:bg-[var(--vendor-primary-btn)]/5",
            disabled && "pointer-events-none opacity-50",
            dropzoneClassName,
          )}
        >
          <CloudUpload className={cn(compact ? "h-3.5 w-3.5" : "h-4 w-4", "text-[var(--vendor-primary-btn)]")} />
          <div>
            <p className="text-[9px] font-black leading-tight text-[var(--vendor-primary-btn)]">
              {title}
            </p>
            {browseText && !compact ? (
              <p className="mt-0.5 text-[8px] font-medium leading-tight text-[var(--vendor-text-muted)]">
                {browseText}
              </p>
            ) : null}
          </div>
          {!compact && (
            <div>
              {hint ? (
                <p className="text-[8px] font-semibold leading-tight text-[var(--vendor-text-muted)]">
                  {hint}
                </p>
              ) : null}
              {recommendedSize ? (
                <p className="text-[8px] font-semibold leading-tight text-[var(--vendor-text-muted)]">
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
