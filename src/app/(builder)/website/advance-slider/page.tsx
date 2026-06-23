"use client";
import * as React from "react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { ImageUpload } from "../_components/image-upload";
import { ImageCropper } from "../_components/image-cropper-lazy";
import { ColorPickerInput } from "../_components/color-picker-input";
import { ToggleField } from "../_components/toggle-field";
import {
  SliderManagementTable,
  type SliderManagementRow,
} from "../_components/slider-management-table";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
  BuilderSelectField,
} from "../_components/builder-field";
import { BuilderLinkTargetField } from "../_components/builder-link-target-field";
import { RangeSliderInput } from "../_components/range-slider-input";
import { FormActions } from "../_components/form-actions";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useCreateSlider,
  useReplaceSliderItems,
  useUpdateSlider,
  useUploadVendorMedia,
  useWebsiteBuilderData,
  useWebsitePages,
} from "@/hooks/use-website-builder";
import { useToast } from "@/components/ui/toast";
import {
  buildPageLinkOptions,
  normalizeLinkTarget,
  resolveLinkTargetHref,
  type LinkTargetValue,
} from "../_lib/link-target";
import { dataUrlToFile, fileToDataUrl } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Slide {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonColor: string;
  buttonTextColor: string;
  imageUrl: string;
  status: boolean;
  linkType: LinkTargetValue["linkType"];
  pageId: string;
  customUrl: string;
}

const initialSlides: Slide[] = [
  {
    id: "1",
    title: "Creating Unforgettable Moments",
    description:
      "From elegant weddings to corporate events, we handle every detail with creativity and perfection. Let us bring your dream event to life.",
    buttonLabel: "Explore Events",
    buttonColor: "#6C47FF",
    buttonTextColor: "#FFFFFF",
    imageUrl: "",
    status: true,
    linkType: "custom",
    pageId: "",
    customUrl: "/events",
  },
  {
    id: "2",
    title: "Perfect Events, Lasting Memories",
    description: "We create beautiful moments that last forever.",
    buttonLabel: "View Services",
    buttonColor: "#6C47FF",
    buttonTextColor: "#FFFFFF",
    imageUrl: "",
    status: true,
    linkType: "custom",
    pageId: "",
    customUrl: "/services",
  },
  {
    id: "3",
    title: "We Plan. You Celebrate.",
    description: "Leave the planning to us and enjoy your special day.",
    buttonLabel: "Contact Us",
    buttonColor: "#6C47FF",
    buttonTextColor: "#FFFFFF",
    imageUrl: "",
    status: true,
    linkType: "custom",
    pageId: "",
    customUrl: "/contact",
  },
];

const card =
  "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm";

// ── Section Label ──────────────────────────────────────────────────────────────
function SectionLabel({ number, label }: { number: number; label: string }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--vendor-text-muted)] pb-1 border-b border-[var(--vendor-border)]">
      <span className="text-[var(--vendor-primary)]">{number}.</span> {label}
    </p>
  );
}

// ── Live Preview Slider ────────────────────────────────────────────────────────
function LivePreviewSlider({
  slides,
  activeIndex,
  overlayOpacity,
  brightness,
  blur,
  titleColor,
  descriptionColor,
}: {
  slides: Slide[];
  activeIndex: number;
  overlayOpacity: number;
  brightness: number;
  blur: number;
  titleColor: string;
  descriptionColor: string;
}) {
  const [current, setCurrent] = React.useState(activeIndex);
  const activeSlides = slides.filter((s) => s.status);

  React.useEffect(() => {
    const idx = activeSlides.findIndex((s) => s.id === slides[activeIndex]?.id);
    if (idx >= 0) setCurrent(idx);
  }, [activeIndex, slides]);

  const slide = activeSlides[current] ?? activeSlides[0];
  if (!slide) return null;

  const prev = () =>
    setCurrent((c) => (c - 1 + activeSlides.length) % activeSlides.length);
  const next = () => setCurrent((c) => (c + 1) % activeSlides.length);

  return (
    <div className={`${card} space-y-2`}>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[12px] font-semibold text-[var(--vendor-text)]">
          Live Preview
        </span>
        <span className="text-[11px] text-[var(--vendor-text-muted)]">
          — This is how your slider will appear on the website.
        </span>
      </div>

      <div
        className="relative overflow-hidden rounded-[var(--vendor-radius-panel)] aspect-[16/7] w-full"
        style={{ filter: `brightness(${brightness / 100})` }}
      >
        {slide.imageUrl ? (
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: blur > 0 ? `blur(${blur}px)` : undefined }}
          />
        ) : (
          <div
            className="absolute inset-0 bg-[linear-gradient(135deg,#1a0a2e,#6b2fa0_40%,#1a1035)]"
            style={{ filter: blur > 0 ? `blur(${blur}px)` : undefined }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})` }}
        />

        <div className="slider-preview-content relative z-10 flex h-full max-w-[60%] flex-col justify-center px-10 py-6">
          <h2
            className="slider-preview-title mb-3 text-2xl font-bold leading-tight drop-shadow"
            style={{ color: titleColor }}
          >
            {slide.title}
          </h2>
          <p
            className="slider-preview-description mb-5 line-clamp-3 text-[13px] leading-relaxed"
            style={{ color: descriptionColor }}
          >
            {slide.description}
          </p>
          <div>
            <button
              className="slider-preview-button rounded px-5 py-2.5 text-[12px] font-semibold shadow-lg transition-opacity hover:opacity-90"
              style={{
                backgroundColor: slide.buttonColor,
                color: slide.buttonTextColor,
              }}
            >
              {slide.buttonLabel}
            </button>
          </div>
        </div>

        {activeSlides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {activeSlides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-5 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function AdvancedSliderPage() {
  const { data: builderData } = useWebsiteBuilderData();
  const pagesQuery = useWebsitePages();
  const createSlider = useCreateSlider();
  const updateSlider = useUpdateSlider();
  const replaceSliderItems = useReplaceSliderItems();
  const uploadMedia = useUploadVendorMedia();
  const { showToast } = useToast();
  const loadedFromApiRef = React.useRef(false);
  const pageOptions = React.useMemo(
    () => buildPageLinkOptions(pagesQuery.data || []),
    [pagesQuery.data],
  );
  const [slides, setSlides] = React.useState<Slide[]>(initialSlides);
  const [sliderTitle, setSliderTitle] = React.useState(
    "Home Page Advanced Slider",
  );
  const [editingIndex, setEditingIndex] = React.useState(0);
  const [titleColor, setTitleColor] = React.useState("#FFFFFF");
  const [descriptionColor, setDescriptionColor] = React.useState("#E6E6E6");
  const [overlayOpacity, setOverlayOpacity] = React.useState(60);
  const [brightness, setBrightness] = React.useState(90);
  const [blur, setBlur] = React.useState(0);
  const [isSaving, setIsSaving] = React.useState(false);
  const [sliderId, setSliderId] = React.useState<string | null>(null);
  const [imageToCrop, setImageToCrop] = React.useState("");
  const [pendingImageFile, setPendingImageFile] = React.useState<File | null>(null);

  const editing = slides[editingIndex] ?? slides[0];

  React.useEffect(() => {
    if (loadedFromApiRef.current || !builderData || !pagesQuery.isSuccess) return;

    const sliders = Array.isArray(builderData.sliders) ? builderData.sliders : [];
    const sliderItems = Array.isArray(builderData.sliderItems) ? builderData.sliderItems : [];
    const advancedSlider = sliders.find(
      (slider) => String((slider as Record<string, unknown>).slider_type || "") === "advanced",
    ) as Record<string, unknown> | undefined;

    if (advancedSlider) {
      const nextSliderId = String(advancedSlider.id || "");
      const config =
        advancedSlider.config_json && typeof advancedSlider.config_json === "object"
          ? (advancedSlider.config_json as Record<string, unknown>)
          : {};
      const nextSlides = sliderItems
        .filter((item) => String((item as Record<string, unknown>).slider_id || "") === nextSliderId)
        .sort(
          (left, right) =>
            Number((left as Record<string, unknown>).sort_order || 0) -
            Number((right as Record<string, unknown>).sort_order || 0),
        )
        .map((item, index) => {
          const record = item as Record<string, unknown>;
          return {
            id: String(record.id || `slide-${index + 1}`),
            title: String(record.title || "New slide title"),
            description: String(record.description || ""),
            buttonLabel: String(record.button_label || ""),
            buttonColor: String(record.button_color || "#6C47FF"),
            buttonTextColor: String(record.button_text_color || "#FFFFFF"),
            imageUrl: String(record.image_url || ""),
            status: Boolean(record.is_active ?? record.status === "active"),
            ...normalizeLinkTarget(
              {
                linkType: record.button_page_id ? "page" : "custom",
                pageId: String(record.button_page_id ?? ""),
                customUrl: String(record.button_url ?? ""),
              },
              pageOptions,
              "/",
            ),
          };
        });

      setSliderId(nextSliderId);
      setSliderTitle(String(advancedSlider.title || "Home Page Advanced Slider"));
      setTitleColor(String(config.titleColor || "#FFFFFF"));
      setDescriptionColor(String(config.descriptionColor || "#E6E6E6"));
      setOverlayOpacity(Number(config.overlayOpacity ?? 60));
      setBrightness(Number(config.brightness ?? 90));
      setBlur(Number(config.blur ?? 0));
      if (nextSlides.length > 0) {
        setSlides(nextSlides);
      }
    }

    loadedFromApiRef.current = true;
  }, [builderData, pageOptions, pagesQuery.isSuccess]);

  const updateEditing = (patch: Partial<Slide>) =>
    setSlides((prev) =>
      prev.map((s, i) => (i === editingIndex ? { ...s, ...patch } : s)),
    );

  const handleSlideImageSelect = async (file: File) => {
    try {
      setPendingImageFile(file);
      setImageToCrop(await fileToDataUrl(file));
    } catch {
      showToast("Unable to read slide image", "error");
    }
  };

  const handleSlideImageCropComplete = async (croppedBase64: string) => {
    const sourceFile = pendingImageFile;
    setImageToCrop("");
    setPendingImageFile(null);
    if (!sourceFile) return;

    try {
      const extension = sourceFile.name.includes(".")
        ? sourceFile.name.slice(sourceFile.name.lastIndexOf("."))
        : ".jpg";
      const croppedFile = await dataUrlToFile(
        croppedBase64,
        `${sourceFile.name.replace(/\.[^.]+$/, "")}-advanced-slider${extension}`,
        sourceFile.type || "image/jpeg",
      );
      const uploaded = await uploadMedia.mutateAsync({
        file: croppedFile,
        folder: "website/sliders/advanced",
      });
      updateEditing({ imageUrl: uploaded.url });
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Image upload failed", "error");
    }
  };

  const handleSlideReorder = (rows: SliderManagementRow[]) => {
    const activeSlideId = slides[editingIndex]?.id;
    const nextSlides = rows
      .map((row) => slides.find((slide) => slide.id === row.id))
      .filter((slide): slide is Slide => Boolean(slide));
    setSlides(nextSlides);
    const nextEditingIndex = nextSlides.findIndex(
      (slide) => slide.id === activeSlideId,
    );
    setEditingIndex(nextEditingIndex >= 0 ? nextEditingIndex : 0);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        slider_type: "advanced",
        title: sliderTitle,
        slider_height: "large",
        autoplay: true,
        autoplay_speed: 5000,
        config_json: {
          titleColor,
          descriptionColor,
          overlayOpacity,
          brightness,
          blur,
        },
        is_active: true,
      };

      const savedSlider = sliderId
        ? await updateSlider.mutateAsync({ id: sliderId, payload })
        : await createSlider.mutateAsync(payload);

      const nextSliderId = String(savedSlider.id);
      setSliderId(nextSliderId);

      await replaceSliderItems.mutateAsync({
        sliderId: nextSliderId,
        items: slides.map((slide, index) => ({
          title: slide.title,
          description: slide.description,
          imageUrl: slide.imageUrl,
          buttonLabel: slide.buttonLabel,
          buttonPageId: slide.linkType === "page" ? slide.pageId : null,
          buttonUrl:
            slide.linkType === "custom"
              ? resolveLinkTargetHref(slide, pageOptions)
              : null,
          buttonColor: slide.buttonColor,
          buttonTextColor: slide.buttonTextColor,
          sortOrder: index + 1,
          status: slide.status ? "published" : "draft",
          is_active: slide.status,
        })),
      });

      showToast("Advanced slider saved");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to save advanced slider", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSlides([
      {
        id: "draft-1",
        title: "",
        description: "",
        buttonLabel: "",
        buttonColor: "#6C47FF",
        buttonTextColor: "#FFFFFF",
        imageUrl: "",
        status: false,
        linkType: "custom",
        pageId: "",
        customUrl: "",
      },
    ]);
    setSliderTitle("");
    setEditingIndex(0);
    setTitleColor("#FFFFFF");
    setDescriptionColor("#E6E6E6");
    setOverlayOpacity(0);
    setBrightness(0);
    setBlur(0);
    setImageToCrop("");
    setPendingImageFile(null);
  };

  const handleDeleteCurrent = () => {
    const currentId = slides[editingIndex]?.id;
    if (!currentId || slides.length <= 1) {
      handleCancel();
      return;
    }
    setSlides((current) => current.filter((slide) => slide.id !== currentId));
    setEditingIndex(0);
  };

  const form = (
    <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
      {/* ── Left: Single stacked form ── */}
      <div className={`${card} space-y-3`}>
        <p className="text-[11px] font-bold text-[var(--vendor-text)] flex items-center gap-1.5">
          {/* <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--vendor-primary)]" /> */}
          Slide Content
        </p>

        <SectionLabel number={1} label="Slider Title" />
        <BuilderCountedInput
          value={sliderTitle}
          onChange={setSliderTitle}
          maxLength={100}
          className="space-y-0.5"
        />

        <SectionLabel number={2} label="Slide Title" />
        <BuilderCountedInput
          value={editing.title}
          onChange={(v) => updateEditing({ title: v })}
          maxLength={100}
          className="space-y-0.5"
        />

        <SectionLabel number={3} label="Slide Description" />
        <BuilderCountedTextarea
          value={editing.description}
          onChange={(v) => updateEditing({ description: v })}
          maxLength={200}
          textareaClassName="!min-h-[72px] !max-h-[90px] resize-none"
          className="space-y-0.5"
        />

        <SectionLabel number={4} label="Button Label" />
        <BuilderCountedInput
          value={editing.buttonLabel}
          onChange={(v) => updateEditing({ buttonLabel: v })}
          maxLength={30}
          className="space-y-0.5"
        />

        <SectionLabel number={5} label="Button Link" />
        <BuilderLinkTargetField
          value={editing}
          onChange={(value) => updateEditing(value)}
          pageOptions={pageOptions}
          pageLabel="Button Page"
        />

        <div className="border-t border-[var(--vendor-border)] pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--vendor-text-muted)] mb-2">
            Overlay & Effects
          </p>
          <div className="space-y-2">
            <RangeSliderInput
              label="6. Overlay Opacity"
              value={overlayOpacity}
              onChange={setOverlayOpacity}
            />
            <RangeSliderInput
              label="7. Brightness"
              value={brightness}
              onChange={setBrightness}
            />
            <RangeSliderInput
              label="8. Blur"
              value={blur}
              onChange={setBlur}
              suffix="px"
            />
          </div>
        </div>


        <div className="border-t border-[var(--vendor-border)] pt-2 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--vendor-text-muted)] mb-1">
            Slide Image
          </p>
          <ImageUpload
            value={editing.imageUrl}
            recommendedSize="1920x800px"
            maxFileSize="2MB"
            maxSizeMb={2}
            onFileSelect={handleSlideImageSelect}
            onRemove={() => updateEditing({ imageUrl: "" })}
            alt="Advanced slider image"
            previewClassName="h-32"
            uploadClassName="min-h-32"
          />
        </div>

        <div className="border-t border-[var(--vendor-border)] pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--vendor-text-muted)] mb-1.5">
            Status
          </p>
          <ToggleField
            label=""
            description="Enable or disable this slide on the website."
            checked={editing.status}
            onCheckedChange={(v) => updateEditing({ status: v })}
            className="border border-[var(--vendor-border)] bg-slate-50/60 px-2 py-1.5 rounded-[var(--vendor-radius-control)]"
          />
        </div>

        <div className="border-t border-[var(--vendor-border)] pt-2">
          <FormActions
            saveLabel="Update Slide"
            onCancel={() => setEditingIndex(0)}
            onSave={() => undefined}
            isSaving={false}
            layout="default"
          />
        </div>
      </div>

      {/* ── Right: Live Preview + Slider Management ── */}
      <div className="flex flex-col gap-3 min-w-0">
        <LivePreviewSlider
          slides={slides}
          activeIndex={editingIndex}
          overlayOpacity={overlayOpacity}
          brightness={brightness}
          blur={blur}
          titleColor={titleColor}
          descriptionColor={descriptionColor}
        />

        <FormSection
          className={`${card} space-y-1.5`}
        >
          <SliderManagementTable
            title="Slider Management"
            subtitle="Add, reorder, or remove slides."
            rows={slides.map((slide) => ({
              id: slide.id,
              title: slide.title,
              buttonLabel: slide.buttonLabel,
              imageUrl: slide.imageUrl,
              enabled: slide.status,
            }))}
            activeRowId={slides[editingIndex]?.id}
            thumbnailFallbackClassName="bg-[linear-gradient(135deg,#1a0a2e,#6b2fa0_40%,#1a1035)]"
            onAdd={() => {
              const nextId = (
                Math.max(...slides.map((s) => Number(s.id)), 0) + 1
              ).toString();
              setSlides((prev) => [
                ...prev,
                {
                  id: nextId,
                  title: "New slide title",
                  description: "Describe what this slide is about.",
                  buttonLabel: "Learn More",
                  buttonColor: "#6C47FF",
                  buttonTextColor: "#FFFFFF",
                  imageUrl: "",
                  status: true,
                  linkType: "custom",
                  pageId: "",
                  customUrl: "/",
                },
              ]);
              setEditingIndex(slides.length);
            }}
            onEdit={(row) => {
              const idx = slides.findIndex((s) => s.id === row.id);
              if (idx >= 0) setEditingIndex(idx);
            }}
            onDelete={(row) => {
              if (slides.length <= 1) return;
              setSlides((prev) => prev.filter((s) => s.id !== row.id));
              setEditingIndex(0);
            }}
            onReorder={handleSlideReorder}
            onStatusChange={(row, enabled) =>
              setSlides((prev) =>
                prev.map((s) =>
                  s.id === row.id ? { ...s, status: enabled } : s,
                ),
              )
            }
          />
        </FormSection>
      </div>
    </div>
  );

  return (
    <>
      <WebsiteBuilderLayout
        title="Advanced Slider"
        form={form}
        onCancel={handleCancel}
        onDelete={handleDeleteCurrent}
        deleteItemLabel={editing?.title || "slide"}
        isSaving={isSaving}
        primaryButton={{
          label: sliderId ? "Update" : "Save",
          onClick: handleSave,
          isLoading: isSaving,
        }}
        leftClassName="border-0 bg-transparent p-0 shadow-none"
      />
      <ImageCropper
        open={Boolean(imageToCrop)}
        imageSrc={imageToCrop}
        onClose={() => {
          setImageToCrop("");
          setPendingImageFile(null);
        }}
        onCropComplete={handleSlideImageCropComplete}
        aspectRatio={12 / 5}
        outputWidth={1920}
        outputHeight={800}
        title="Crop Slide Image"
      />
    </>
  );
}
