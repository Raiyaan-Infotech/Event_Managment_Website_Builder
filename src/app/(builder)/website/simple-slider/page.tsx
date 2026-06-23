"use client";
import * as React from "react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { ImageUpload } from "../_components/image-upload";
import { ImageCropper } from "../_components/image-cropper-lazy";
import { ColorPickerInput } from "../_components/color-picker-input";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { FormActions } from "../_components/form-actions";
import { RadioGroup } from "../_components/radio-group";
import {
  useCreateSlider,
  useReplaceSliderItems,
  useSaveHeroSection,
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
  imageUrl: string;
  status: boolean;
  linkType: LinkTargetValue["linkType"];
  pageId: string;
  customUrl: string;
}

type SliderHeight = "small" | "medium" | "large" | "fullscreen";
type EditorMode = "edit" | "new";

const initialSlides: Slide[] = [
  {
    id: "1",
    title: "Creating Unforgettable Moments",
    description:
      "From elegant weddings to corporate events, we handle every detail with creativity and perfection. Let us bring your dream event to life.",
    buttonLabel: "Explore Events",
    buttonColor: "#6C47FF",
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
    buttonLabel: "View Service",
    buttonColor: "#6C47FF",
    imageUrl: "",
    status: true,
    linkType: "custom",
    pageId: "",
    customUrl: "/service",
  },
  {
    id: "3",
    title: "We Plan. You Celebrate.",
    description: "Leave the planning to us and enjoy your special day.",
    buttonLabel: "Contact Us",
    buttonColor: "#6C47FF",
    imageUrl: "",
    status: true,
    linkType: "custom",
    pageId: "",
    customUrl: "/contact",
  },
];

const card = "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-2.5 shadow-sm";

const sliderHeightOptions = [
  { label: "Small (400px)", value: "small" },
  { label: "Medium (600px)", value: "medium" },
  { label: "Large (800px)", value: "large" },
  { label: "Full Screen", value: "fullscreen" },
];

// ── Live Preview Slider ────────────────────────────────────────────────────────
function LivePreviewSlider({
  slides,
  activeIndex,
  sliderHeight,
}: {
  slides: Slide[];
  activeIndex: number;
  sliderHeight: SliderHeight;
}) {
  const [current, setCurrent] = React.useState(activeIndex);
  const activeSlides = slides.filter((s) => s.status);
  const heightClass =
    sliderHeight === "small"
      ? "h-[220px]"
      : sliderHeight === "large"
        ? "h-[420px]"
        : sliderHeight === "fullscreen"
          ? "h-[520px]"
          : "h-[320px]";

  React.useEffect(() => {
    const idx = activeSlides.findIndex((s) => s.id === slides[activeIndex]?.id);
    if (idx >= 0) setCurrent(idx);
  }, [activeIndex, slides]);

  const slide = activeSlides[current] ?? activeSlides[0];
  if (!slide) return null;

  const prev = () => setCurrent((c) => (c - 1 + activeSlides.length) % activeSlides.length);
  const next = () => setCurrent((c) => (c + 1) % activeSlides.length);

  return (
    <div className={`${card} space-y-3`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[12px] font-semibold text-[var(--vendor-text)]">Live Preview</span>
        <span className="text-[11px] text-[var(--vendor-text-muted)]">— This is how your slider will appear on the website.</span>
      </div>

      {/* Slider */}
      <div className={`relative w-full overflow-hidden rounded-[var(--vendor-radius-panel)] bg-[linear-gradient(135deg,#1a0a2e,#6b2fa0_40%,#1a1035)] ${heightClass}`}>
        {/* Background image */}
        {slide.imageUrl ? (
          <img
            src={slide.imageUrl}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#1a0a2e,#6b2fa0_40%,#1a1035)]" />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div className="slider-preview-content relative z-10 flex h-full max-w-[65%] flex-col justify-center px-8 py-6">
          <h2 className="slider-preview-title mb-2 text-xl font-bold leading-tight text-white drop-shadow">
            {slide.title}
          </h2>
          <p className="slider-preview-description mb-4 line-clamp-3 text-[11px] leading-relaxed text-white/80">
            {slide.description}
          </p>
          <div>
            <button
              className="slider-preview-button rounded px-4 py-2 text-[11px] font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: slide.buttonColor }}
            >
              {slide.buttonLabel}
            </button>
          </div>
        </div>

        {/* Prev / Next arrows */}
        {activeSlides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Dots */}
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
export default function SimpleSliderPage() {
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
  const [sliderTitle, setSliderTitle] = React.useState("Home Page Slider");
  const [sliderHeight, setSliderHeight] = React.useState<SliderHeight>("medium");
  const [editingIndex, setEditingIndex] = React.useState(0);
  const [editorMode, setEditorMode] = React.useState<EditorMode>("edit");
  const [isSaving, setIsSaving] = React.useState(false);
  const [sliderId, setSliderId] = React.useState<string | null>(null);
  const [imageToCrop, setImageToCrop] = React.useState("");
  const [pendingImageFile, setPendingImageFile] = React.useState<File | null>(null);

  const editing = slides[editingIndex] ?? slides[0];

  React.useEffect(() => {
    if (loadedFromApiRef.current || !builderData || !pagesQuery.isSuccess) return;

    const sliders = Array.isArray(builderData.sliders) ? builderData.sliders : [];
    const sliderItems = Array.isArray(builderData.sliderItems) ? builderData.sliderItems : [];
    const simpleSlider = sliders.find(
      (slider) => String((slider as Record<string, unknown>).slider_type || "") === "simple",
    ) as Record<string, unknown> | undefined;

    if (simpleSlider) {
      const nextSliderId = String(simpleSlider.id || "");
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
      setSliderTitle(String(simpleSlider.title || "Home Page Slider"));
      setSliderHeight(String(simpleSlider.slider_height || "medium") as SliderHeight);
      if (nextSlides.length > 0) {
        setSlides(nextSlides);
      }
    }

    loadedFromApiRef.current = true;
  }, [builderData, pageOptions, pagesQuery.isSuccess]);

  const updateEditing = (patch: Partial<Slide>) => {
    setSlides((prev) =>
      prev.map((s, i) => (i === editingIndex ? { ...s, ...patch } : s)),
    );
  };

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
        `${sourceFile.name.replace(/\.[^.]+$/, "")}-slider${extension}`,
        sourceFile.type || "image/jpeg",
      );
      const uploaded = await uploadMedia.mutateAsync({
        file: croppedFile,
        folder: "website/sliders/simple",
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
    const nextEditingIndex = nextSlides.findIndex((slide) => slide.id === activeSlideId);
    setEditingIndex(nextEditingIndex >= 0 ? nextEditingIndex : 0);
  };

  const handleSlideSave = () => {
    setEditorMode("edit");
  };

  const handleSlideCancel = () => {
    if (editorMode === "new") {
      const currentId = slides[editingIndex]?.id;
      setSlides((prev) => {
        const nextSlides = prev.filter((slide) => slide.id !== currentId);
        return nextSlides.length ? nextSlides : initialSlides;
      });
      setEditingIndex(0);
      setEditorMode("edit");
      return;
    }

    setEditingIndex(0);
  };

  const handleCancel = () => {
    setSlides([
      {
        id: "draft-1",
        title: "",
        description: "",
        buttonLabel: "",
        buttonColor: "#6C47FF",
        imageUrl: "",
        status: false,
        linkType: "custom",
        pageId: "",
        customUrl: "",
      },
    ]);
    setSliderTitle("");
    setSliderHeight("medium");
    setEditingIndex(0);
    setEditorMode("new");
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
    setEditorMode("edit");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        slider_type: "simple",
        title: sliderTitle,
        slider_height: sliderHeight,
        autoplay: true,
        autoplay_speed: 5000,
        config_json: {},
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
          sortOrder: index + 1,
          status: slide.status ? "published" : "draft",
          is_active: slide.status,
        })),
      });

      showToast("Simple slider saved");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to save simple slider", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const form = (
  <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">

    {/* ── Left: Slide Settings ── */}
    <FormSection
      title="Slide Settings"
      subtitle="Add and edit slide information for the homepage slider."
      className={`${card} space-y-3`}
    >
      <BuilderCountedInput
        label="Slider Title"
        value={sliderTitle}
        onChange={(v) => setSliderTitle(v)}
        maxLength={100}
        className="space-y-0.5"
      />
      <div className="space-y-1.5 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] p-2.5">
        <div>
          <h3 className="text-[13px] font-black text-[var(--vendor-text)]">
            Slider Height
          </h3>
          <p className="mt-0.5 text-[11px] font-medium text-[var(--vendor-text-muted)]">
            Set the height of the slider section.
          </p>
        </div>
        <RadioGroup
          value={sliderHeight}
          onChange={(value) => setSliderHeight(value as SliderHeight)}
          options={sliderHeightOptions}
        />
      </div>
      <BuilderCountedInput
        label="Slide Title"
        value={editing.title}
        onChange={(v) => updateEditing({ title: v })}
        maxLength={100}
        className="space-y-0.5"
      />
      <BuilderCountedTextarea
        label="Slide Description"
        value={editing.description}
        onChange={(v) => updateEditing({ description: v })}
        maxLength={200}
        textareaClassName="!min-h-[60px] !max-h-[80px] resize-none"
        className="space-y-0.5"
      />
      <BuilderCountedInput
        label="Button Label"
        value={editing.buttonLabel}
        onChange={(v) => updateEditing({ buttonLabel: v })}
        maxLength={30}
        className="space-y-0.5"
      />
      <BuilderLinkTargetField
        value={editing}
        onChange={(value) => updateEditing(value)}
        pageOptions={pageOptions}
        pageLabel="Button Page"
        className="space-y-0.5"
      />
        <ImageUpload
          label="Slide Image"
          value={editing.imageUrl}
          recommendedSize="1920x800px"
          maxFileSize="2MB"
          maxSizeMb={2}
          onFileSelect={handleSlideImageSelect}
          onRemove={() => updateEditing({ imageUrl: "" })}
          alt="Slider image"
          previewClassName="h-32"
          uploadClassName="min-h-32"
        />
      <div className="space-y-0.5">
        <label className="block text-[11px] font-medium">Status</label>
        <div className="flex items-center justify-between rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] px-3 py-2">
          <span className="text-[11px] text-[var(--vendor-text-muted)]">Enable or disable this slide.</span>
          <Switch
            checked={editing.status}
            onCheckedChange={(v) => updateEditing({ status: v })}
          />
        </div>
      </div>
      <div className="border-t border-[var(--vendor-border)] pt-2">
        <FormActions
          saveLabel={editorMode === "new" ? "Save Slide" : "Update Slide"}
          onCancel={handleSlideCancel}
          onSave={handleSlideSave}
          isSaving={false}
          layout="default"
        />
      </div>
    </FormSection>

    {/* ── Right: Live Preview + Slider Management ── */}
    <div className="flex flex-col gap-3 min-w-0">

      {/* Live Preview */}
      <LivePreviewSlider
        slides={slides}
        activeIndex={editingIndex}
        sliderHeight={sliderHeight}
      />

      {/* Slider Management Table */}
      <FormSection
        title="Slider Management"
        subtitle="Add, reorder, or remove slides."
        className={`${card} space-y-1.5`}
      >
        <SliderManagementTable
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
            const nextId = (Math.max(...slides.map((s) => Number(s.id)), 0) + 1).toString();
            const newSlide: Slide = {
              id: nextId,
              title: "New slide title",
              description: "Describe what this slide is about.",
              buttonLabel: "Learn More",
              buttonColor: "#6C47FF",
              imageUrl: "",
              status: true,
              linkType: "custom",
              pageId: "",
              customUrl: "/",
            };
            setSlides((prev) => [...prev, newSlide]);
            setEditingIndex(slides.length);
            setEditorMode("new");
          }}
          onEdit={(row) => {
            const nextIndex = slides.findIndex((slide) => slide.id === row.id);
            if (nextIndex >= 0) {
              setEditingIndex(nextIndex);
              setEditorMode("edit");
            }
          }}
          onDelete={(row) => {
            if (slides.length <= 1) return;
            setSlides((prev) => prev.filter((s) => s.id !== row.id));
            setEditingIndex(0);
            setEditorMode("edit");
          }}
          onReorder={handleSlideReorder}
          onStatusChange={(row, enabled) => {
            setSlides((prev) =>
              prev.map((s) => (s.id === row.id ? { ...s, status: enabled } : s)),
            );
          }}
        />
      </FormSection>
    </div>
  </div>
);

  return (
    <>
      <WebsiteBuilderLayout
        title="Simple Slider"
        form={form}
        onCancel={handleCancel}
        onDelete={handleDeleteCurrent}
        deleteItemLabel={editing?.title || "slide"}
        isSaving={isSaving}
        primaryButton={{
          label: editorMode === "new" ? "Save" : "Update",
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
