"use client";

import * as React from "react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { BuilderCountedInput } from "../_components/builder-field";
import {
  MultiImageUpload,
  type MultiImageUploadItem,
} from "../_components/multi-image-upload";
import { ImageCropper } from "../_components/image-cropper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateGalleryItem,
  useDeleteGalleryItem,
  useGalleryCategories,
  useGalleryItems,
  useUploadVendorMedia,
} from "@/hooks/use-website-builder";
import { resolveMediaUrl } from "@/lib/utils";
import { buildGalleryFilterOptions, mapGalleryCategories } from "./_lib/gallery-categories";

const card =
  "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm";

type GalleryEditorImage = MultiImageUploadItem & {
  file?: File;
  recordId?: number;
  categoryValue?: string;
};

function GalleryPreview({
  images,
  filters,
  selectedFilterValue,
}: {
  images: GalleryEditorImage[];
  filters: Array<{ label: string; value: string }>;
  selectedFilterValue?: string | null;
}) {
  const [activeFilter, setActiveFilter] = React.useState("all");

  const filterOptions = React.useMemo(
    () => [{ label: "All", value: "all" }, ...filters],
    [filters],
  );

  React.useEffect(() => {
    setActiveFilter(selectedFilterValue || "all");
  }, [selectedFilterValue]);

  const visibleImages = React.useMemo(() => {
    if (activeFilter === "all") return images;
    return images.filter((image) => image.categoryValue === activeFilter);
  }, [activeFilter, images]);

  return (
    <div className={`${card} flex flex-col gap-3`}>
      <div className="flex flex-wrap items-start gap-2">
        <span className="mt-1 h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-500" />
        <span className="shrink-0 text-[12px] font-semibold leading-4 text-[var(--vendor-text)]">
          Gallery Preview
        </span>
        <span className="min-w-0 flex-1 text-[11px] leading-4 text-[var(--vendor-text-muted)]">
          This is how your gallery will appear on the website.
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {filterOptions.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              activeFilter === filter.value
                ? "bg-[var(--vendor-primary-btn)] text-[var(--vendor-primary-btn-text)]"
                : "bg-transparent text-[var(--vendor-text)] hover:bg-[var(--vendor-secondary-btn)]"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {visibleImages.length > 0 ? (
        <div className="[column-count:3] [column-gap:2px] overflow-hidden rounded-[var(--vendor-radius-control)] bg-slate-200">
          {visibleImages.map((img) => (
            <div key={img.id} className="mb-[2px] break-inside-avoid overflow-hidden">
              <img
                src={img.imageUrl}
                alt={img.alt ?? "Gallery image"}
                className="block w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="[column-count:3] [column-gap:2px] overflow-hidden rounded-[var(--vendor-radius-control)] bg-slate-100">
          {[180, 120, 150, 140, 160, 110, 130, 170, 125].map((height, index) => (
            <div
              key={index}
              className="mb-[2px] break-inside-avoid bg-slate-200"
              style={{ height }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function GalleryPage() {
  const { data: categoryRecords = [] } = useGalleryCategories();
  const { data: galleryItemRecords = [] } = useGalleryItems();
  const createGalleryItem = useCreateGalleryItem();
  const deleteGalleryItem = useDeleteGalleryItem();
  const uploadVendorMedia = useUploadVendorMedia();

  const [eventName, setEventName] = React.useState("");
  const [selectedCategoryId, setSelectedCategoryId] = React.useState("");
  const [city, setCity] = React.useState("");
  const [pendingImages, setPendingImages] = React.useState<GalleryEditorImage[]>([]);
  const [cropperOpen, setCropperOpen] = React.useState(false);
  const [imageToCrop, setImageToCrop] = React.useState("");
  const [activeCropItem, setActiveCropItem] = React.useState<{
    file: File;
    dataUrl: string;
    categoryValue?: string;
  } | null>(null);
  const [cropQueue, setCropQueue] = React.useState<
    Array<{ file: File; dataUrl: string; categoryValue?: string }>
  >([]);
  const [isSaving, setIsSaving] = React.useState(false);

  const categories = React.useMemo(
    () => mapGalleryCategories(categoryRecords, galleryItemRecords),
    [categoryRecords, galleryItemRecords],
  );

  const activeCategoryOptions = React.useMemo(
    () => buildGalleryFilterOptions(categories),
    [categories],
  );

  React.useEffect(() => {
    if (!selectedCategoryId && activeCategoryOptions.length) {
      setSelectedCategoryId(String(activeCategoryOptions[0].id));
    }
  }, [activeCategoryOptions, selectedCategoryId]);

  React.useEffect(() => {
    if ((eventName || city || selectedCategoryId) || !galleryItemRecords.length) return;
    const firstItem = galleryItemRecords[0];
    if (firstItem.event_name) setEventName(firstItem.event_name);
    if (firstItem.city) setCity(firstItem.city);
    if (firstItem.category_id) setSelectedCategoryId(String(firstItem.category_id));
  }, [city, eventName, galleryItemRecords, selectedCategoryId]);

  const selectedCategory = React.useMemo(
    () =>
      activeCategoryOptions.find(
        (category) => String(category.id) === selectedCategoryId,
      ) || null,
    [activeCategoryOptions, selectedCategoryId],
  );

  const openNextInQueue = React.useCallback(
    (queue: Array<{ file: File; dataUrl: string; categoryValue?: string }>) => {
      if (!queue.length) {
        setImageToCrop("");
        setCropperOpen(false);
        setActiveCropItem(null);
        setCropQueue([]);
        return;
      }
      const [current, ...rest] = queue;
      setActiveCropItem(current);
      setImageToCrop(current.dataUrl);
      setCropperOpen(true);
      setCropQueue(rest);
    },
    [],
  );

  const persistedImages = React.useMemo<GalleryEditorImage[]>(() => {
    const categoryMap = new Map(
      activeCategoryOptions.map((category) => [String(category.id), category]),
    );

    return galleryItemRecords
      .filter((item) => !!item.image_url)
      .map((item) => {
        const matchedCategory = item.category_id
          ? categoryMap.get(String(item.category_id))
          : undefined;
        return {
          id: `saved-${item.id}`,
          recordId: item.id,
          imageUrl: resolveMediaUrl(item.image_url),
          alt: item.alt_text || item.event_name || "Gallery image",
          categoryValue:
            matchedCategory?.value ||
            (item.event_type
              ? item.event_type.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
              : undefined),
        };
      });
  }, [activeCategoryOptions, galleryItemRecords]);

  const galleryImages = React.useMemo(
    () => [...persistedImages, ...pendingImages],
    [pendingImages, persistedImages],
  );

  const addImages = (files: File[]) => {
    if (!files.length) return;

    Promise.allSettled(
      files.map(
        (file) =>
          new Promise<{ file: File; dataUrl: string; categoryValue?: string }>((resolve, reject) => {
            if (file.size > 5 * 1024 * 1024) {
              reject(new Error(`${file.name} is too large.`));
              return;
            }

            const reader = new FileReader();
            reader.onloadend = () =>
              resolve({
                file,
                dataUrl: String(reader.result || ""),
                categoryValue: selectedCategory?.value,
              });
            reader.onerror = () => reject(reader.error || new Error("Unable to read file"));
            reader.readAsDataURL(file);
          }),
      ),
    )
      .then((results) => {
        const items = results
          .filter(
            (
              result,
            ): result is PromiseFulfilledResult<{
              file: File;
              dataUrl: string;
              categoryValue?: string;
            }> => result.status === "fulfilled",
          )
          .map((result) => result.value);
        openNextInQueue(items);
      });
  };

  const removeImage = async (item: MultiImageUploadItem) => {
    const target = item as GalleryEditorImage;

    if (target.recordId) {
      await deleteGalleryItem.mutateAsync(target.recordId);
      return;
    }

    setPendingImages((current) => current.filter((image) => image.id !== target.id));
  };

  const resetPendingImages = () => {
    setPendingImages([]);
  };

  const handleCropComplete = (croppedBase64: string) => {
    const current = activeCropItem;
    if (!current) {
      setCropperOpen(false);
      setImageToCrop("");
      setActiveCropItem(null);
      setCropQueue([]);
      return;
    }

    fetch(croppedBase64)
      .then((response) => response.blob())
      .then((blob) => {
        const extension = current.file.name.includes(".")
          ? current.file.name.slice(current.file.name.lastIndexOf("."))
          : ".jpg";
        const croppedFile = new File(
          [blob],
          `${current.file.name.replace(/\.[^.]+$/, "")}-cropped${extension}`,
          { type: blob.type || current.file.type || "image/jpeg" },
        );

        setPendingImages((previous) => [
          ...previous,
          {
            id: `pending-${Date.now()}-${Math.random()}`,
            imageUrl: croppedBase64,
            alt: current.file.name,
            file: croppedFile,
            categoryValue: current.categoryValue,
          },
        ]);

        if (cropQueue.length) {
          openNextInQueue(cropQueue);
        } else {
          setCropQueue([]);
          setImageToCrop("");
          setActiveCropItem(null);
          setCropperOpen(false);
        }
      });
  };

  const handleSave = async () => {
    if (!eventName.trim() || !city.trim() || !selectedCategory) return;
    const filesToSave = pendingImages.filter((item) => item.file);
    if (!filesToSave.length) return;

    setIsSaving(true);
    try {
      const startOrder = galleryItemRecords.length + 1;
      await Promise.all(
        filesToSave.map(async (item, index) => {
          const uploaded = await uploadVendorMedia.mutateAsync({
            file: item.file as File,
            folder: "website/gallery",
          });

          await createGalleryItem.mutateAsync({
            category_id: selectedCategory.id,
            event_name: eventName.trim(),
            event_type: selectedCategory.label,
            city: city.trim(),
            image_url: uploaded.url,
            alt_text: item.alt || eventName.trim(),
            sort_order: startOrder + index,
            is_active: true,
          });
        }),
      );

      resetPendingImages();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEventName("");
    setCity("");
    if (activeCategoryOptions.length) {
      setSelectedCategoryId(String(activeCategoryOptions[0].id));
    }
    resetPendingImages();
  };

  const form = (
    <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[280px_1fr]">
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
            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
              <SelectTrigger
                className="h-9 w-full px-2 text-[11px] font-semibold"
                disabled={!activeCategoryOptions.length}
              >
                <span className="truncate">
                  {selectedCategory?.label || "Select category"}
                </span>
              </SelectTrigger>
              <SelectContent>
                {activeCategoryOptions.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!activeCategoryOptions.length ? (
              <p className="text-[10px] text-[var(--vendor-text-muted)]">
                Create a gallery category first.
              </p>
            ) : null}
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
            maxItems={50}
            tileSize={72}
            variant="fullwidth"
            uploadHeight={120}
            hint="PNG, JPG up to 5MB"
          />
        </FormSection>
      </div>

      <GalleryPreview
        images={galleryImages}
        filters={activeCategoryOptions.map((category) => ({
          label: category.label,
          value: category.value,
        }))}
        selectedFilterValue={selectedCategory?.value || "all"}
      />
    </div>
  );

  return (
    <>
      <WebsiteBuilderLayout
        title="Gallery"
        form={form}
        saveLabel="Save Gallery"
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        leftClassName="border-0 bg-transparent p-0 shadow-none"
        howItWorksLabel="How It Works"
        onHowItWorks={() => alert("This is where you'd explain how to use the gallery editor.")}
        primaryButton={{
          label: "Save Gallery",
          onClick: handleSave,
          isLoading: isSaving,
          disabled:
            !eventName.trim() ||
            !city.trim() ||
            !selectedCategory ||
            !pendingImages.some((item) => item.file),
        }}
      />
      <ImageCropper
        open={cropperOpen}
        imageSrc={imageToCrop}
        onClose={() => {
          setCropperOpen(false);
          setImageToCrop("");
          setActiveCropItem(null);
          setCropQueue([]);
        }}
        onCropComplete={handleCropComplete}
        aspectRatio={4 / 3}
        outputWidth={1200}
        outputHeight={900}
        title="Crop Gallery Image"
      />
    </>
  );
}
