"use client";
import * as React from "react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { ImageUpload } from "../_components/image-upload";
import { ColorPickerInput } from "../_components/color-picker-input";
import {
  SliderManagementTable,
  type SliderManagementRow,
} from "../_components/slider-management-table";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
} from "../_components/builder-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { List, SlidersHorizontal, ChevronLeft, ChevronRight, Circle, Wifi } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { FormActions } from "../_components/form-actions";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Slide {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonPage: string;
  buttonColor: string;
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
    imageUrl: "",
    status: true,
  },
];

const card = "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-2.5 shadow-sm";

// ── Live Preview Slider ────────────────────────────────────────────────────────
function LivePreviewSlider({ slides, activeIndex }: { slides: Slide[]; activeIndex: number }) {
  const [current, setCurrent] = React.useState(activeIndex);
  const activeSlides = slides.filter((s) => s.status);

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
      <div className="relative overflow-hidden rounded-[var(--vendor-radius-panel)] bg-[linear-gradient(135deg,#1a0a2e,#6b2fa0_40%,#1a1035)] aspect-[16/7] w-full">
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
        <div className="relative z-10 flex h-full flex-col justify-center px-8 py-6 max-w-[65%]">
          <h2 className="text-white font-bold text-xl leading-tight mb-2 drop-shadow">
            {slide.title}
          </h2>
          <p className="text-white/80 text-[11px] leading-relaxed mb-4 line-clamp-3">
            {slide.description}
          </p>
          <div>
            <button
              className="rounded px-4 py-2 text-[11px] font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
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
  const [slides, setSlides] = React.useState<Slide[]>(initialSlides);
  const [sliderTitle, setSliderTitle] = React.useState("Home Page Slider");
  const [editingIndex, setEditingIndex] = React.useState(0);
  const [isSaving, setIsSaving] = React.useState(false);

  const editing = slides[editingIndex] ?? slides[0];

  const updateEditing = (patch: Partial<Slide>) => {
    setSlides((prev) =>
      prev.map((s, i) => (i === editingIndex ? { ...s, ...patch } : s)),
    );
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

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleCancel = () => {
    setSlides(initialSlides);
    setSliderTitle("Home Page Slider");
    setEditingIndex(0);
  };

  const form = (
  <div className="grid gap-3 grid-cols-1 lg:grid-cols-[1fr_1.6fr]">

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
      <div className="space-y-0.5">
        <label className="block text-[11px] font-medium">Button Page</label>
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
      </div>
      <div className="space-y-0.5">
        <label className="block text-[11px] font-medium">Button Color</label>
        <ColorPickerInput
          value={editing.buttonColor}
          onChange={(color) => updateEditing({ buttonColor: color })}
        />
      </div>
      <ImageUpload
        label="Slide Image"
        value={editing.imageUrl}
        recommendedSize="1920x800px"
        maxFileSize="2MB"
        onFileSelect={(file) => {
          const url = URL.createObjectURL(file);
          updateEditing({ imageUrl: url });
        }}
        onRemove={() => updateEditing({ imageUrl: "" })}
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
      {/* <div className="border-t border-[var(--vendor-border)] pt-1.5">
        <FormActions
          saveLabel="Update Slide"
          onCancel={() => setEditingIndex(0)}
          onSave={handleSave}
          isSaving={isSaving}
          layout="default"
        />
      </div> */}
    </FormSection>

    {/* ── Right: Live Preview + Slider Management ── */}
    <div className="flex flex-col gap-3 min-w-0">

      {/* Live Preview */}
      <LivePreviewSlider slides={slides} activeIndex={editingIndex} />

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
              buttonPage: "home",
              buttonColor: "#6C47FF",
              imageUrl: "",
              status: true,
            };
            setSlides((prev) => [...prev, newSlide]);
            setEditingIndex(slides.length);
          }}
          onEdit={(row) => {
            const nextIndex = slides.findIndex((slide) => slide.id === row.id);
            if (nextIndex >= 0) setEditingIndex(nextIndex);
          }}
          onDelete={(row) => {
            if (slides.length <= 1) return;
            setSlides((prev) => prev.filter((s) => s.id !== row.id));
            setEditingIndex(0);
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
    <WebsiteBuilderLayout
      title="Simple Slider"
      form={form}
      saveLabel="Save Changes"
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
      primaryButton={{
        label: "Save Changes",
        onClick: handleSave,
        isLoading: isSaving,
      }}
      onHowItWorks={() =>
        alert("This is where you'd explain how to use the page editor.")
      }
    />
  );
}