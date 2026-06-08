"use client";

import * as React from "react";
import { CloudUpload, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiImageUploadItem {
  id: string | number;
  imageUrl: string;
  alt?: string;
}

interface MultiImageUploadProps {
  items: MultiImageUploadItem[];
  onAdd?: (files: File[]) => void;
  onRemove?: (item: MultiImageUploadItem) => void;
  label?: string;
  maxItems?: number;
  accept?: string;
  disabled?: boolean;
  tileSize?: number;
  uploadTitle?: string;
  browseText?: string;
  hint?: string;
  className?: string;
  gridClassName?: string;
  tileClassName?: string;
  uploadTileClassName?: string;
}

export function MultiImageUpload({
  items,
  onAdd,
  onRemove,
  label,
  maxItems = 20,
  accept = "image/png,image/jpeg,image/webp",
  disabled = false,
  tileSize = 92,
  uploadTitle = "Upload Images",
  browseText = "or drag and drop",
  hint = "PNG, JPG up to 5MB",
  className,
  gridClassName,
  tileClassName,
  uploadTileClassName,
}: MultiImageUploadProps) {
  const inputId = React.useId();
  const [isDragging, setIsDragging] = React.useState(false);
  const canAdd = !disabled && items.length < maxItems;

  const addFiles = (fileList: FileList | File[] | null | undefined) => {
    if (!fileList || !canAdd) return;
    const availableSlots = Math.max(maxItems - items.length, 0);
    const files = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, availableSlots);

    if (files.length) onAdd?.(files);
  };

  const tileStyle = {
    width: tileSize,
    height: tileSize,
  } satisfies React.CSSProperties;

  return (
    <div className={cn("space-y-3", className)}>
      {label ? (
        <p className="text-[12px] font-semibold text-[var(--vendor-text)]">{label}</p>
      ) : null}

      <div
        className={cn("grid gap-2", gridClassName)}
        style={{
          gridTemplateColumns: `repeat(auto-fill, ${tileSize}px)`,
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "relative overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] shadow-sm",
              tileClassName,
            )}
            style={tileStyle}
          >
            <img
              src={item.imageUrl}
              alt={item.alt ?? "Uploaded gallery image"}
              className="h-full w-full object-cover"
            />
            {onRemove ? (
              <button
                type="button"
                onClick={() => onRemove(item)}
                disabled={disabled}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--vendor-border)] bg-white/95 text-[var(--vendor-text)] shadow-sm hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            ) : null}
          </div>
        ))}

        {canAdd ? (
          <label
            htmlFor={inputId}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              addFiles(event.dataTransfer.files);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--vendor-radius-panel)] border border-dashed p-2 text-center transition-colors",
              isDragging
                ? "border-[var(--vendor-primary-btn)] bg-[var(--vendor-primary-btn)]/5"
                : "border-[var(--vendor-primary-btn)]/35 bg-[var(--vendor-panel-bg)] hover:border-[var(--vendor-primary-btn)] hover:bg-[var(--vendor-primary-btn)]/5",
              uploadTileClassName,
            )}
            style={tileStyle}
          >
            <CloudUpload className="h-5 w-5 text-[var(--vendor-primary-btn)]" />
            <div>
              <p className="text-[9px] font-black leading-tight text-[var(--vendor-primary-btn)]">
                {uploadTitle}
              </p>
              <p className="mt-0.5 text-[8px] font-medium leading-tight text-[var(--vendor-text-muted)]">
                {browseText}
              </p>
            </div>
            <p className="text-[8px] font-semibold leading-tight text-[var(--vendor-text-muted)]">
              {hint}
            </p>
            <input
              id={inputId}
              type="file"
              accept={accept}
              multiple
              className="sr-only"
              disabled={disabled}
              onChange={(event) => {
                addFiles(event.target.files);
                event.currentTarget.value = "";
              }}
            />
          </label>
        ) : null}
      </div>

      <p className="text-[12px] font-medium text-[var(--vendor-text-muted)]">
        You can upload up to {maxItems} images.
      </p>
    </div>
  );
}
