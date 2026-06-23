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
  recommendedSize?: string;
  maxFileSize?: string;
  /** Maximum allowed image size in MB. Larger files are skipped. Default 2. */
  maxSizeMb?: number;
  hint?: string;
  variant?: "tile" | "fullwidth";
  uploadHeight?: number;
  hideTiles?: boolean;
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
  recommendedSize,
  maxFileSize,
  maxSizeMb = 2,
  hint,
  variant = "tile",
  uploadHeight = 180,
  hideTiles = false,
  className,
  gridClassName,
  tileClassName,
  uploadTileClassName,
}: MultiImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputId = React.useId();
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState("");
  const canAdd = !disabled && items.length < maxItems;
  const maxBytes = maxSizeMb > 0 ? maxSizeMb * 1024 * 1024 : Infinity;

  const addFiles = (fileList: FileList | File[] | null | undefined) => {
    if (!fileList || !canAdd) return;
    const availableSlots = Math.max(maxItems - items.length, 0);
    const images = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
    );
    const tooBig = images.filter((file) => file.size > maxBytes);
    const files = images
      .filter((file) => file.size <= maxBytes)
      .slice(0, availableSlots);

    if (tooBig.length) {
      setError(
        `${tooBig.length === 1 ? "1 image is" : `${tooBig.length} images are`} larger than ${maxSizeMb}MB and ${tooBig.length === 1 ? "was" : "were"} skipped.`,
      );
    } else {
      setError("");
    }

    if (files.length) onAdd?.(files);
  };

  const sizeHint = maxFileSize ?? (maxSizeMb > 0 ? `${maxSizeMb}MB` : undefined);
  const hintText = hint ?? (
    recommendedSize
      ? `${recommendedSize}${sizeHint ? ` (Max: ${sizeHint})` : ""}`
      : sizeHint
      ? `(Max: ${sizeHint})`
      : null
  );

  const dragHandlers = {
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); },
    onDragLeave: () => setIsDragging(false),
    onDrop: (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); },
  };

  const dragClass = isDragging
    ? "border-[var(--vendor-primary-btn)] bg-[var(--vendor-primary-btn)]/[0.04]"
    : "hover:bg-slate-100/60";

  return (
    <div className={cn("space-y-3", className)}>
      {label ? (
        <p className="text-[12px] font-semibold text-[var(--vendor-text)]">{label}</p>
      ) : null}

      {/* ── Full-width upload box ── */}
      {variant === "fullwidth" && canAdd && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          {...dragHandlers}
          className={cn(
            "flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--vendor-radius-panel)] border border-dashed border-[var(--vendor-border)] bg-slate-50/60 text-center transition-colors",
            dragClass,
            uploadTileClassName,
          )}
          style={{ height: uploadHeight }}
        >
          <CloudUpload className="h-6 w-6 text-[var(--vendor-text-muted)] mb-0.5" />
          <p className="text-[11px] font-semibold text-[var(--vendor-text)]">Click to upload</p>
          <p className="text-[10px] text-[var(--vendor-text-muted)]">or drag and drop</p>
          {hintText && (
            <p className="text-[10px] text-[var(--vendor-text-muted)] mt-0.5 leading-tight">{hintText}</p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple
            className="hidden"
            disabled={disabled}
            onChange={(e) => { addFiles(e.target.files); e.currentTarget.value = ""; }}
          />
        </div>
      )}

      {/* ── Tile grid ── */}
      {!hideTiles && items.length > 0 && (
        <div
          className={cn("grid gap-2", gridClassName)}
          style={{ gridTemplateColumns: `repeat(auto-fill, ${tileSize}px)` }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "relative overflow-hidden rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] shadow-sm",
                tileClassName,
              )}
              style={{ width: tileSize, height: tileSize }}
            >
              <img
                src={item.imageUrl}
                alt={item.alt ?? "Uploaded image"}
                className="h-full w-full object-cover"
              />
              {onRemove ? (
                <button
                  type="button"
                  onClick={() => onRemove(item)}
                  disabled={disabled}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              ) : null}
            </div>
          ))}

          {/* tile upload button inside grid */}
          {variant === "tile" && canAdd && (
            <label
              htmlFor={inputId}
              {...dragHandlers}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--vendor-radius-control)] border border-dashed border-[var(--vendor-border)] bg-slate-50/60 p-2 text-center transition-colors",
                dragClass,
                uploadTileClassName,
              )}
              style={{ width: tileSize, height: tileSize }}
            >
              <CloudUpload className="h-5 w-5 text-[var(--vendor-text-muted)] mb-0.5" />
              <p className="text-[10px] font-semibold text-[var(--vendor-text)]">Click to upload</p>
              <p className="text-[9px] text-[var(--vendor-text-muted)]">or drag and drop</p>
              <input
                id={inputId}
                type="file"
                accept={accept}
                multiple
                className="sr-only"
                disabled={disabled}
                onChange={(e) => { addFiles(e.target.files); e.currentTarget.value = ""; }}
              />
            </label>
          )}
        </div>
      )}

      {/* tile mode empty state */}
      {variant === "tile" && canAdd && items.length === 0 && (
        <div
          className={cn("grid gap-2", gridClassName)}
          style={{ gridTemplateColumns: `repeat(auto-fill, ${tileSize}px)` }}
        >
          <label
            htmlFor={inputId}
            {...dragHandlers}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--vendor-radius-control)] border border-dashed border-[var(--vendor-border)] bg-slate-50/60 p-2 text-center transition-colors",
              dragClass,
              uploadTileClassName,
            )}
            style={{ width: tileSize, height: tileSize }}
          >
            <CloudUpload className="h-5 w-5 text-[var(--vendor-text-muted)] mb-0.5" />
            <p className="text-[10px] font-semibold text-[var(--vendor-text)]">Click to upload</p>
            <p className="text-[9px] text-[var(--vendor-text-muted)]">or drag and drop</p>
            <input
              id={inputId}
              type="file"
              accept={accept}
              multiple
              className="sr-only"
              disabled={disabled}
              onChange={(e) => { addFiles(e.target.files); e.currentTarget.value = ""; }}
            />
          </label>
        </div>
      )}

      {error && (
        <p className="text-[11px] font-medium text-rose-500">{error}</p>
      )}

      <p className="text-[12px] font-medium text-[var(--vendor-text-muted)]">
        You can upload up to {maxItems} images.
      </p>
    </div>
  );
}