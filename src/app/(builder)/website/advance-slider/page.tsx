"use client";
import * as React from "react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { ImageUpload } from "../_components/image-upload";
import { ColorPickerInput } from "../_components/color-picker-input";
import { ToggleField } from "../_components/toggle-field";
import {
  SliderManagementTable,
  type SliderManagementRow,
} from "../_components/slider-management-table";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
} from "../_components/builder-field";
import { RangeSliderInput } from "../_components/range-slider-input";
import { FormActions } from "../_components/form-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  List,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Slide {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonPage: string;
  buttonColor: string;
  buttonTextColor: string;
  imageUrl: string;
  status: boolean;
}

const initialSlides: Slide[] = [
  {
    id: "1",
    title: "Creating Unforgettable Moments",
    description:
      "From elegant weddings to corporate events, we handle every detail with creativity and perfection. Let us bring your dream event to life.",
    buttonLabel: "Explore Events",
    buttonPage: "events",
    buttonColor: "#6C47FF",
    buttonTextColor: "#FFFFFF",
    imageUrl: "",
    status: true,
  },
  {
    id: "2",
    title: "Perfect Events, Lasting Memories",
    description: "We create beautiful moments that last forever.",
    buttonLabel: "View Services",
    buttonPage: "services",
    buttonColor: "#6C47FF",
    buttonTextColor: "#FFFFFF",
    imageUrl: "",
    status: true,
  },
  {
    id: "3",
    title: "We Plan. You Celebrate.",
    description: "Leave the planning to us and enjoy your special day.",
    buttonLabel: "Contact Us",
    buttonPage: "contact",
    buttonColor: "#6C47FF",
    buttonTextColor: "#FFFFFF",
    imageUrl: "",
    status: true,
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

        <div className="relative z-10 flex h-full flex-col justify-center px-10 py-6 max-w-[60%]">
          <h2
            className="font-bold text-2xl leading-tight mb-3 drop-shadow"
            style={{ color: titleColor }}
          >
            {slide.title}
          </h2>
          <p
            className="text-[13px] leading-relaxed mb-5 line-clamp-3"
            style={{ color: descriptionColor }}
          >
            {slide.description}
          </p>
          <div>
            <button
              className="rounded px-5 py-2.5 text-[12px] font-semibold shadow-lg transition-opacity hover:opacity-90"
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

  const editing = slides[editingIndex] ?? slides[0];

  const updateEditing = (patch: Partial<Slide>) =>
    setSlides((prev) =>
      prev.map((s, i) => (i === editingIndex ? { ...s, ...patch } : s)),
    );

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

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleCancel = () => {
    setSlides(initialSlides);
    setSliderTitle("Home Page Advanced Slider");
    setEditingIndex(0);
    setTitleColor("#FFFFFF");
    setDescriptionColor("#E6E6E6");
    setOverlayOpacity(60);
    setBrightness(90);
    setBlur(0);
  };

  const form = (
    <div className="grid gap-3 grid-cols-1 lg:grid-cols-[400px_1fr] items-start">
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

        <SectionLabel number={5} label="Button Page" />
        <Select
          value={editing.buttonPage}
          onValueChange={(v) => updateEditing({ buttonPage: v })}
        >
          <SelectTrigger className="h-9 w-full text-[11px] px-2 font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home">Home</SelectItem>
            <SelectItem value="about">About Us</SelectItem>
            <SelectItem value="services">Services</SelectItem>
            <SelectItem value="events">Events</SelectItem>
            <SelectItem value="gallery">Gallery</SelectItem>
            <SelectItem value="contact">Contact Us</SelectItem>
          </SelectContent>
        </Select>

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

        <div className="border-t border-[var(--vendor-border)] pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--vendor-text-muted)] mb-2">
            Colors
          </p>
          <div className="grid grid-cols-2 gap-2">
            <ColorPickerInput
              label="9. Title Color"
              value={titleColor}
              onChange={setTitleColor}
              compact
            />
            <ColorPickerInput
              label="10. Description Color"
              value={descriptionColor}
              onChange={setDescriptionColor}
              compact
            />
          </div>
        </div>

        <div className="border-t border-[var(--vendor-border)] pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--vendor-text-muted)] mb-2">
            Button Settings
          </p>
          <div className="grid grid-cols-2 gap-2">
            <ColorPickerInput
              label="11. Background Color"
              value={editing.buttonColor}
              onChange={(c) => updateEditing({ buttonColor: c })}
              compact
            />
            <ColorPickerInput
              label="12. Text Color"
              value={editing.buttonTextColor}
              onChange={(c) => updateEditing({ buttonTextColor: c })}
              compact
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
            onFileSelect={(file) =>
              updateEditing({ imageUrl: URL.createObjectURL(file) })
            }
            onRemove={() => updateEditing({ imageUrl: "" })}
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
            onSave={handleSave}
            isSaving={isSaving}
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
                  buttonPage: "home",
                  buttonColor: "#6C47FF",
                  buttonTextColor: "#FFFFFF",
                  imageUrl: "",
                  status: true,
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
    <WebsiteBuilderLayout
      title="Advanced Slider"
      form={form}
      saveLabel="Save Changes"
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
    />
  );
}
