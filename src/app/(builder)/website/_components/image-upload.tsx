"use client";
import * as React from "react";
import { CloudUpload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label?: string;
  value?: string;
  recommendedSize?: string;
  maxFileSize?: string;
  /** Maximum allowed image size in MB. Larger files are rejected. Default 2. */
  maxSizeMb?: number;
  onFileSelect?: (file: File) => void;
  onRemove?: () => void;
  className?: string;
  previewClassName?: string;
  uploadClassName?: string;
  alt?: string;
}

export function ImageUpload({
  label,
  value,
  recommendedSize,
  maxFileSize,
  maxSizeMb = 2,
  onFileSelect,
  onRemove,
  className,
  previewClassName,
  uploadClassName,
  alt = "Uploaded image",
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState("");

  const maxBytes = maxSizeMb > 0 ? maxSizeMb * 1024 * 1024 : Infinity;
  const sizeHint = maxFileSize ?? (maxSizeMb > 0 ? `${maxSizeMb}MB` : undefined);

  const handleClick = () => inputRef.current?.click();

  const acceptFile = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > maxBytes) {
      setError(`Image is too large. Maximum ${maxSizeMb}MB.`);
      return;
    }
    setError("");
    onFileSelect?.(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    acceptFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    acceptFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label className="block text-[11px] font-semibold text-[var(--vendor-text-muted)] uppercase tracking-[0.15em]">
          {label}
        </label>
      )}

      {value ? (
        /* ── Uploaded state ── */
        <div className="relative rounded-[var(--vendor-radius-control)] overflow-hidden border border-[var(--vendor-border)]">
          <img
            src={value}
            alt={alt}
            className={cn("w-full h-24 object-cover", previewClassName)}
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        /* ── Empty / upload state ── */
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-1 rounded-[var(--vendor-radius-control)] border border-dashed border-[var(--vendor-border)] bg-slate-50/60 px-4 py-4 text-center cursor-pointer hover:bg-slate-100/60 transition-colors",
            uploadClassName,
          )}
        >
          <CloudUpload className="h-6 w-6 text-[var(--vendor-text-muted)] mb-0.5" />
          <p className="text-[11px] font-semibold text-[var(--vendor-text)]">
            Click to upload
          </p>
          <p className="text-[10px] text-[var(--vendor-text-muted)]">
            or drag and drop
          </p>
          {(recommendedSize || sizeHint) && (
            <p className="text-[10px] text-[var(--vendor-text-muted)] mt-0.5 leading-tight">
              {recommendedSize && <>Recommended: {recommendedSize}<br /></>}
              {sizeHint && `(Max: ${sizeHint})`}
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="text-[10px] font-medium text-rose-500">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
