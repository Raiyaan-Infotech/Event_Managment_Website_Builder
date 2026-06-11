"use client";
import * as React from "react";
import { CloudUpload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label?: string;
  value?: string;
  recommendedSize?: string;
  maxFileSize?: string;
  onFileSelect?: (file: File) => void;
  onRemove?: () => void;
  className?: string;
}

export function ImageUpload({
  label,
  value,
  recommendedSize,
  maxFileSize,
  onFileSelect,
  onRemove,
  className,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) onFileSelect(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && onFileSelect) onFileSelect(file);
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
            alt="Slide"
            className="w-full h-24 object-cover"
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
          className="flex flex-col items-center justify-center gap-1 rounded-[var(--vendor-radius-control)] border border-dashed border-[var(--vendor-border)] bg-slate-50/60 px-4 py-4 text-center cursor-pointer hover:bg-slate-100/60 transition-colors"
        >
          <CloudUpload className="h-6 w-6 text-[var(--vendor-text-muted)] mb-0.5" />
          <p className="text-[11px] font-semibold text-[var(--vendor-text)]">
            Click to upload
          </p>
          <p className="text-[10px] text-[var(--vendor-text-muted)]">
            or drag and drop
          </p>
          {(recommendedSize || maxFileSize) && (
            <p className="text-[10px] text-[var(--vendor-text-muted)] mt-0.5 leading-tight">
              {recommendedSize && <>Recommended: {recommendedSize}<br /></>}
              {maxFileSize && `(Max: ${maxFileSize})`}
            </p>
          )}
        </div>
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