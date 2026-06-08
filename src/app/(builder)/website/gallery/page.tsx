"use client";

import * as React from "react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import {
  DesktopMobileToggle,
  type PreviewDevice,
} from "../_components/desktop-mobile-toggle";
import {
  BuilderCountedInput,
} from "../_components/builder-field";
import {
  MultiImageUpload,
  type MultiImageUploadItem,
} from "../_components/multi-image-upload";
import { OutlineButton, PrimaryButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const galleryFilters = ["All", "Wedding", "Corporate", "Birthday", "Conference", "Exhibition", "Other"];

function GalleryPreview({
  images,
  activeFilter,
  onFilterChange,
}: {
  images: MultiImageUploadItem[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {galleryFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={cn(
              "h-9 rounded-[var(--vendor-radius-control)] border px-5 text-[12px] font-bold transition-colors",
              activeFilter === filter
                ? "border-[var(--vendor-primary-btn)] bg-[var(--vendor-primary-btn)] text-white"
                : "border-[var(--vendor-border)] bg-white text-[var(--vendor-text)] hover:border-[var(--vendor-primary-btn)] hover:text-[var(--vendor-primary-btn)]",
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {images.length ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={cn(
                "overflow-hidden rounded-[var(--vendor-radius-panel)] bg-slate-100",
                index === 3 || index === 4 ? "sm:col-span-1" : "",
              )}
            >
              <img
                src={image.imageUrl}
                alt={image.alt ?? "Gallery preview image"}
                className="h-48 w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[320px] items-center justify-center rounded-[var(--vendor-radius-panel)] border border-dashed border-[var(--vendor-border)] bg-slate-50 text-center">
          <div>
            <p className="text-[15px] font-black text-[var(--vendor-text)]">No Gallery Images</p>
            <p className="mt-1 text-[12px] font-medium text-[var(--vendor-text-muted)]">
              Upload images from the left panel to preview the gallery.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GalleryPage() {
  const [device, setDevice] = React.useState<PreviewDevice>("desktop");
  const [eventName, setEventName] = React.useState("Sarah & Michael Wedding");
  const [eventType, setEventType] = React.useState("Wedding");
  const [city, setCity] = React.useState("New York, USA");
  const [activeFilter, setActiveFilter] = React.useState("All");
  const [galleryImages, setGalleryImages] = React.useState<MultiImageUploadItem[]>([]);
  const objectUrlsRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const addImages = (files: File[]) => {
    const createdImages = files.map((file, index) => {
      const imageUrl = URL.createObjectURL(file);
      objectUrlsRef.current.push(imageUrl);

      return {
        id: `${file.name}-${file.lastModified}-${index}-${Date.now()}`,
        imageUrl,
        alt: file.name,
      };
    });

    setGalleryImages((current) => [...current, ...createdImages]);
  };

  const removeImage = (item: MultiImageUploadItem) => {
    if (item.imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(item.imageUrl);
      objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== item.imageUrl);
    }

    setGalleryImages((current) => current.filter((image) => image.id !== item.id));
  };

  const form = (
    <div className="rounded-[var(--vendor-radius-panel)] bg-[var(--vendor-panel-bg)]">
      <div className="border-b border-[var(--vendor-border)] px-5 py-4">
        <h2 className="text-[16px] font-black text-[var(--vendor-text)]">Gallery Information</h2>
        <p className="mt-0.5 text-[12px] font-medium text-[var(--vendor-text-muted)]">
          Add details about the event gallery.
        </p>
      </div>

      <div className="space-y-5 p-5">
        <BuilderCountedInput
          label="Event Name"
          value={eventName}
          onChange={setEventName}
          maxLength={100}
        />
        <BuilderCountedInput
          label="Event Type"
          value={eventType}
          onChange={setEventType}
          maxLength={100}
        />
        <BuilderCountedInput
          label="City"
          value={city}
          onChange={setCity}
          maxLength={100}
        />
        <MultiImageUpload
          label="Gallery Images"
          items={galleryImages}
          onAdd={addImages}
          onRemove={removeImage}
          maxItems={20}
          tileSize={92}
        />
      </div>

      <div className="flex gap-3 border-t border-[var(--vendor-border)] p-5">
        <PrimaryButton type="button" className="flex-1">
          Save Gallery
        </PrimaryButton>
        <OutlineButton type="button" className="flex-1">
          Cancel
        </OutlineButton>
      </div>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Gallery"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Website Builder", href: "/website" },
        { label: "Gallery" },
      ]}
      form={form}
      preview={
        <GalleryPreview
          images={galleryImages}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      }
      previewTitle="Gallery Preview"
      previewSubtitle="This is how your gallery will appear on the website."
      previewActions={<DesktopMobileToggle value={device} onChange={setDevice} />}
      saveLabel="Save Gallery"
      contentClassName="xl:grid-cols-[minmax(360px,35fr)_minmax(0,65fr)]"
    />
  );
}
