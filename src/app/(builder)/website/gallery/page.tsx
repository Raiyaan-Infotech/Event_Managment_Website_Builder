"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
} from "../_components/builder-field";
import {
  MultiImageUpload,
  type MultiImageUploadItem,
} from "../_components/multi-image-upload";
import { ImageCropper } from "../_components/image-cropper-lazy";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateGalleryItem,
  useCreateGalleryCategory,
  useDeleteGalleryItem,
  useGalleryCategories,
  useGalleryItems,
  useUploadVendorMedia,
} from "@/hooks/use-website-builder";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/toast";
import { resolveMediaUrl } from "@/lib/utils";
import {
  buildGalleryFilterOptions,
  mapGalleryCategories,
  toSlug,
} from "./_lib/gallery-categories";

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
  onSave,
  saveDisabled,
  isSaving,
  onAddCategory,
}: {
  images: GalleryEditorImage[];
  filters: Array<{ label: string; value: string }>;
  selectedFilterValue?: string | null;
  onSave?: () => void;
  saveDisabled?: boolean;
  isSaving?: boolean;
  onAddCategory: () => void;
}) {
  const [activeFilter, setActiveFilter] = React.useState("all");
  const [confirmOpen, setConfirmOpen] = React.useState(false);

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
        {onSave ? (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={saveDisabled || isSaving}
            className="shrink-0 rounded-md bg-[var(--vendor-primary-btn)] px-3 py-1.5 text-[11px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving…" : "Save Gallery"}
          </button>
        ) : null}
        <button
          type="button"
          onClick={onAddCategory}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--vendor-primary-btn)] px-3 py-1.5 text-[11px] font-bold text-white transition hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Category
        </button>
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {visibleImages.map((img) => (
            <div
              key={img.id}
              className="aspect-[4/3] overflow-hidden rounded-[12px] bg-slate-100"
            >
              <img
                src={img.imageUrl}
                alt={img.alt ?? "Gallery image"}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/3] rounded-[12px] bg-slate-200"
            />
          ))}
        </div>
      )}

      {confirmOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-[12px] bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-[15px] font-black text-[var(--vendor-text)]">
              Save gallery?
            </h3>
            <p className="mt-1.5 text-[12px] text-[var(--vendor-text-muted)]">
              The selected images will be saved and shown on your website gallery.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-md border border-[var(--vendor-border)] px-3 py-1.5 text-[12px] font-semibold text-[var(--vendor-text-muted)] transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  onSave?.();
                }}
                className="rounded-md bg-[var(--vendor-primary-btn)] px-4 py-1.5 text-[12px] font-bold text-white transition hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type GalleryCategoryDraft = {
  name: string;
  slug: string;
  description: string;
  active: boolean;
  order: number;
};

function GalleryCategoryModal({
  open,
  nextOrder,
  isSaving,
  onClose,
  onSave,
}: {
  open: boolean;
  nextOrder: number;
  isSaving: boolean;
  onClose: () => void;
  onSave: (draft: GalleryCategoryDraft) => Promise<void>;
}) {
  const [draft, setDraft] = React.useState<GalleryCategoryDraft>({
    name: "",
    slug: "",
    description: "",
    active: true,
    order: nextOrder,
  });

  React.useEffect(() => {
    if (!open) return;
    setDraft({
      name: "",
      slug: "",
      description: "",
      active: true,
      order: nextOrder,
    });
  }, [nextOrder, open]);

  if (!open) return null;

  const canSave = Boolean(draft.name.trim() && toSlug(draft.slug || draft.name));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]"
      onClick={() => !isSaving && onClose()}
    >
      <form
        className="w-full max-w-2xl rounded-[12px] border border-[var(--vendor-border)] bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault();
          if (canSave && !isSaving) void onSave(draft);
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-black text-[var(--vendor-text)]">
              Add Gallery Category
            </h2>
            <p className="mt-1 text-[11px] text-[var(--vendor-text-muted)]">
              Create a category without leaving the Gallery Images page.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--vendor-radius-control)] text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close category modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <BuilderCountedInput
            label="Category Name"
            required
            value={draft.name}
            onChange={(name) =>
              setDraft((current) => ({
                ...current,
                name,
                slug: toSlug(name),
              }))
            }
            maxLength={80}
            placeholder="e.g. Wedding"
          />
          <BuilderCountedInput
            label="Slug"
            required
            value={draft.slug}
            onChange={(slug) =>
              setDraft((current) => ({ ...current, slug: toSlug(slug) }))
            }
            maxLength={80}
            placeholder="e.g. wedding"
          />
          <BuilderCountedTextarea
            label="Description (Optional)"
            value={draft.description}
            onChange={(description) =>
              setDraft((current) => ({ ...current, description }))
            }
            maxLength={180}
            placeholder="Write a short description..."
            textareaClassName="min-h-[92px]"
            className="sm:col-span-2"
          />
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-slate-600">Status</p>
            <div className="flex h-9 items-center justify-between rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white px-3 shadow-xs">
              <span className="text-[11px] font-bold text-slate-700">
                {draft.active ? "Active" : "Inactive"}
              </span>
              <Switch
                checked={draft.active}
                onCheckedChange={(active) =>
                  setDraft((current) => ({ ...current, active }))
                }
              />
            </div>
          </div>
          <BuilderCountedInput
            label="Display Order"
            value={String(draft.order)}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                order: Math.max(1, Number(value.replace(/\D/g, "")) || 1),
              }))
            }
            maxLength={3}
            showCount={false}
          />
        </div>

        <div className="mt-5 flex justify-end gap-2 border-t border-[var(--vendor-border)] pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-9 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] px-4 text-[12px] font-semibold text-[var(--vendor-text-muted)] transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave || isSaving}
            className="h-9 rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)] px-4 text-[12px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Gallery Category"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function GalleryPage() {
  const { data: categoryRecords = [] } = useGalleryCategories();
  const { data: galleryItemRecords = [] } = useGalleryItems();
  const createGalleryCategory = useCreateGalleryCategory();
  const createGalleryItem = useCreateGalleryItem();
  const deleteGalleryItem = useDeleteGalleryItem();
  const uploadVendorMedia = useUploadVendorMedia();
  const { showToast } = useToast();

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
  const [categoryModalOpen, setCategoryModalOpen] = React.useState(false);
  const [isCategorySaving, setIsCategorySaving] = React.useState(false);
  const categoryInitializedRef = React.useRef(false);
  const galleryDetailsInitializedRef = React.useRef(false);

  const categories = React.useMemo(
    () => mapGalleryCategories(categoryRecords, galleryItemRecords),
    [categoryRecords, galleryItemRecords],
  );

  const activeCategoryOptions = React.useMemo(
    () => buildGalleryFilterOptions(categories),
    [categories],
  );

  const handleCreateCategory = async (draft: GalleryCategoryDraft) => {
    setIsCategorySaving(true);
    try {
      const created = await createGalleryCategory.mutateAsync({
        name: draft.name.trim(),
        slug: toSlug(draft.slug || draft.name),
        description: draft.description.trim(),
        sort_order: draft.order,
        is_active: draft.active,
      });
      setSelectedCategoryId(String(created.id));
      setCategoryModalOpen(false);
      showToast("Gallery category saved");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to save gallery category",
        "error",
      );
    } finally {
      setIsCategorySaving(false);
    }
  };

  React.useEffect(() => {
    if (!categoryInitializedRef.current && activeCategoryOptions.length) {
      categoryInitializedRef.current = true;
      setSelectedCategoryId(String(activeCategoryOptions[0].id));
    }
  }, [activeCategoryOptions]);

  React.useEffect(() => {
    if (galleryDetailsInitializedRef.current || !galleryItemRecords.length) return;
    galleryDetailsInitializedRef.current = true;
    const firstItem = galleryItemRecords[0];
    if (firstItem.event_name) setEventName(firstItem.event_name);
    if (firstItem.city) setCity(firstItem.city);
    if (firstItem.category_id) setSelectedCategoryId(String(firstItem.category_id));
  }, [galleryItemRecords]);

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
            // Size limit is enforced centrally by <MultiImageUpload maxSizeMb />,
            // so only valid (<= limit) image files reach here.
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

        if (items.length) openNextInQueue(items);
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
    setSelectedCategoryId("");
    setCategoryModalOpen(false);
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
            maxSizeMb={5}
            tileSize={72}
            variant="fullwidth"
            uploadHeight={120}
            hint="Recommended: 1200x900px gallery image (Max. 5MB each)"
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
        onAddCategory={() => setCategoryModalOpen(true)}
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
      <GalleryCategoryModal
        open={categoryModalOpen}
        nextOrder={categories.length + 1}
        isSaving={isCategorySaving}
        onClose={() => setCategoryModalOpen(false)}
        onSave={handleCreateCategory}
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
