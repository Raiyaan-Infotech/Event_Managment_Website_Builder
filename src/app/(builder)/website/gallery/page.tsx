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
import { Image as ImageIcon, Info, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const card =
  "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm";

export default function GalleryPage() {
  const [eventName, setEventName] = React.useState("Sarah & Michael Wedding");
  const [eventType, setEventType] = React.useState("Wedding");
  const [city, setCity] = React.useState("New York, USA");
  const [galleryImages, setGalleryImages] = React.useState<
    MultiImageUploadItem[]
  >([]);
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
    <div className="space-y-3">
      <div className="grid min-h-0 gap-3 grid-cols-1 lg:h-full lg:grid-cols-[380px_1fr]">
        {/* ── Left: Gallery Info (fixed, no scroll) ── */}
        <div className="dense-builder-form flex flex-col gap-3 min-h-0 min-w-0">
          <FormSection
            title="Gallery Information"
            icon={<ImageIcon className="h-4 w-4" />}
            subtitle="Add details about the gallery."
            className={`${card} space-y-2`}
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
              <label className="block">
                Event Type <span className="text-rose-500">*</span>
              </label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="h-6 w-full text-[9px] px-2 font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wedding">Wedding</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Birthday">Birthday</SelectItem>
                  <SelectItem value="Conference">Conference</SelectItem>
                  <SelectItem value="Exhibition">Exhibition</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
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

          {/* Note card */}
          <div className={`${card} flex items-start gap-2.5`}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[hsl(228_64%_96%)] text-[#2457d6]">
              <Info className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[var(--vendor-text)]">
                Note:
              </p>
              <p className="mt-0.5 text-[10px] text-[var(--vendor-text-muted)]">
                This information will be used to organize and display your
                gallery.
              </p>
            </div>
          </div>
        </div>

        {/* ── Right: Gallery Images (scrollable when many images) ── */}
        <div className="dense-builder-form flex flex-col min-w-0 lg:min-h-0 lg:overflow-y-auto">
          <FormSection
            title="Gallery Images"
            icon={<Sparkles className="h-4 w-4" />}
            subtitle="Upload and manage images for this gallery."
            className={`${card} space-y-2 lg:h-full`}
          >
            <MultiImageUpload
              label="Gallery Images"
              items={galleryImages}
              onAdd={addImages}
              onRemove={removeImage}
              maxItems={20}
              tileSize={120}
              variant="fullwidth"
              uploadHeight={180}
              hint="JPG, PNG or WebP (Max. 5MB)"
            />
          </FormSection>
        </div>
      </div>

      {/* ── Bottom Save / Cancel ── */}
      {/* <div className="mt-2">
      <FormActions
        saveLabel="Save Gallery"
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        layout="end"
      />
    </div> */}
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
    />
  );
}
