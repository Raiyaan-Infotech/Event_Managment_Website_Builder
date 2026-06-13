"use client";

import * as React from "react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { BuilderCountedInput } from "../_components/builder-field";
import {
  MultiImageUpload,
  type MultiImageUploadItem,
} from "../_components/multi-image-upload";
import { FormActions } from "../_components/form-actions";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DesktopMobileToggle, type PreviewDevice } from "../_components/desktop-mobile-toggle";

const card =
  "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm";

const EVENT_TYPES = ["Wedding", "Corporate", "Birthday", "Conference", "Exhibition", "Other"];

// ── Gallery Preview Panel ──────────────────────────────────────────────────────
function GalleryPreview({
  images,
  eventType,
}: {
  images: MultiImageUploadItem[];
  eventType: string;
}) {
  const [activeFilter, setActiveFilter] = React.useState("All");
  const filters = ["All", ...EVENT_TYPES];

  return (
    <div className={`${card} flex flex-col gap-3`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[12px] font-semibold text-[var(--vendor-text)]">Gallery Preview</span>
        <span className="text-[11px] text-[var(--vendor-text-muted)]">
          — This is how your gallery will appear on the website.
        </span>
      </div>

      {/* Filter pills */}
      {/* Filter pills */}
<div className="flex flex-wrap gap-1.5">
  {filters.map((f) => (
    <button
      key={f}
      type="button"
      onClick={() => setActiveFilter(f)}
      className={`rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors ${
        activeFilter === f
          ? "bg-[var(--vendor-primary-btn)] text-[var(--vendor-primary-btn-text)]"
          : "bg-transparent text-[var(--vendor-text)] hover:bg-[var(--vendor-secondary-btn)]"
      }`}
    >
      {f}
    </button>
  ))}
</div>

      {/* Masonry grid */}
{images.length > 0 ? (
  <div className="[column-count:3] [column-gap:2px] bg-slate-200 rounded-[var(--vendor-radius-control)] overflow-hidden">
    {images.map((img) => (
      <div
        key={img.id}
        className="break-inside-avoid mb-[2px] overflow-hidden"
      >
        <img
          src={img.imageUrl}
          alt={img.alt ?? "Gallery image"}
          className="w-full object-cover block"
        />
      </div>
    ))}
  </div>
) : (
  <div className="[column-count:3] [column-gap:2px] bg-slate-100 rounded-[var(--vendor-radius-control)] overflow-hidden">
    {[180, 120, 150, 140, 160, 110, 130, 170, 125].map((h, i) => (
      <div
        key={i}
        className="break-inside-avoid mb-[2px] bg-slate-200"
        style={{ height: h }}
      />
    ))}
  </div>
)}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const [eventName, setEventName] = React.useState("Sarah & Michael Wedding");
  const [eventType, setEventType] = React.useState("Wedding");
  const [city, setCity] = React.useState("New York, USA");
  const [galleryImages, setGalleryImages] = React.useState<MultiImageUploadItem[]>([]);
  const objectUrlsRef = React.useRef<string[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleCancel = () => {
    setEventName("Sarah & Michael Wedding");
    setEventType("Wedding");
    setCity("New York, USA");
    setGalleryImages([]);
  };

  React.useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const addImages = (files: File[]) => {
    const created = files.map((file, i) => {
      const imageUrl = URL.createObjectURL(file);
      objectUrlsRef.current.push(imageUrl);
      return {
        id: `${file.name}-${Date.now()}-${i}`,
        imageUrl,
        alt: file.name,
      };
    });
    setGalleryImages((prev) => [...prev, ...created]);
  };

  const removeImage = (item: MultiImageUploadItem) => {
    if (item.imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(item.imageUrl);
      objectUrlsRef.current = objectUrlsRef.current.filter(
        (u) => u !== item.imageUrl,
      );
    }
    setGalleryImages((prev) => prev.filter((img) => img.id !== item.id));
  };

  const form = (
    <div className="grid gap-3 grid-cols-1 lg:grid-cols-[280px_1fr] items-start">

      {/* ── Left: Form ── */}
      <div className="flex flex-col gap-3">
        <FormSection
          title="Gallery Information"
          subtitle="Add details about the event gallery."
          className={`${card} space-y-3`}
        >
          <BuilderCountedInput
            label="Event Name"
            required
            value={eventName}
            onChange={setEventName}
            maxLength={100}
            className="space-y-0.5"
          />
          <div className="space-y-0.5">
            <label className="block text-[11px] font-medium">
              Event Type <span className="text-rose-500">*</span>
            </label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger className="h-9 w-full text-[11px] px-2 font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <BuilderCountedInput
            label="City"
            required
            value={city}
            onChange={setCity}
            maxLength={100}
            className="space-y-0.5"
          />
        </FormSection>

        <FormSection
          title="Gallery Images"
          subtitle="Upload multiple images for this gallery."
          className={`${card} space-y-2`}
        >
          <MultiImageUpload
            label=""
            items={galleryImages}
            onAdd={addImages}
            onRemove={removeImage}
            maxItems={20}
            tileSize={72}
            variant="fullwidth"
            uploadHeight={120}
            hint="PNG, JPG up to 5MB"
          />
        </FormSection>
      </div>

      {/* ── Right: Live Preview ── */}
      <GalleryPreview images={galleryImages} eventType={eventType} />

    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Gallery"
      form={form}
      saveLabel="Save Gallery"
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
      howItWorksLabel="How It Works"
      onHowItWorks={() =>
        alert("This is where you'd explain how to use the gallery editor.")
      }
        primaryButton={{
        label: "Save Gallery",
        onClick: handleSave,
        isLoading: isSaving,
      }}
    />
  );
}