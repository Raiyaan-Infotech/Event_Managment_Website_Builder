"use client";
import * as React from "react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "../_components/image-upload";
import { ColorPickerInput } from "../_components/color-picker-input";
import { ToggleField } from "../_components/toggle-field";
import { SliderManagementTable } from "../_components/slider-management-table";
import {
  DesktopMobileToggle,
  type PreviewDevice,
} from "../_components/desktop-mobile-toggle";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RangeSliderInput } from "../_components/range-slider-input";
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

// ── Slider Preview ─────────────────────────────────────────────────────────────
function SliderPreview({
  slides,
  activeIndex,
}: {
  slides: Slide[];
  activeIndex: number;
}) {
  const slide = slides[activeIndex] ?? slides[0];
  const [current, setCurrent] = React.useState(activeIndex);

  React.useEffect(() => setCurrent(activeIndex), [activeIndex]);

  return (
    <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-slate-950 shadow-sm">
      {/* Slide area */}
      <div className="relative min-h-[340px] overflow-hidden">
        {/* Gradient background placeholder */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#1a0a2e,#6b2fa0_40%,#1a1035)]" />
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div className="relative flex min-h-[340px] flex-col justify-center px-10 py-10 text-white">
          <h2 className="max-w-lg text-4xl font-black leading-tight tracking-tight">
            {slides[current]?.title || "Slide Title"}
          </h2>
          <p className="mt-4 max-w-md text-base font-medium leading-7 text-white/80">
            {slides[current]?.description || "Slide description goes here."}
          </p>
          <div className="mt-6">
            <button
              className="rounded-[var(--vendor-radius-control)] px-6 py-3 text-sm font-bold text-white"
              style={{
                backgroundColor: slides[current]?.buttonColor ?? "#6C47FF",
              }}
            >
              {slides[current]?.buttonLabel || "Button"}
            </button>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={() =>
            setCurrent((p) => (p - 1 + slides.length) % slides.length)
          }
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setCurrent((p) => (p + 1) % slides.length)}
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === current ? "w-6 bg-white" : "w-2 bg-white/40",
              )}
            />
          ))}
        </div>
      </div>

      {/* Slider Management */}
      <div className="bg-white p-5">
        <SliderManagementTable
          rows={slides.map((slide) => ({
            id: slide.id,
            title: slide.title,
            buttonLabel: slide.buttonLabel,
            imageUrl: slide.imageUrl,
            enabled: slide.status,
          }))}
          activeRowId={slides[current]?.id}
          thumbnailFallbackClassName="bg-[linear-gradient(135deg,#1a0a2e,#6b2fa0_40%,#1a1035)]"
          onAdd={() => undefined}
          onEdit={(row) => {
            const nextIndex = slides.findIndex((slide) => slide.id === row.id);
            if (nextIndex >= 0) setCurrent(nextIndex);
          }}
          onDelete={() => undefined}
        />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdvancedSliderPage() {
  const [device, setDevice] = React.useState<PreviewDevice>("desktop");
  const [slides, setSlides] = React.useState<Slide[]>(initialSlides);
  const [sliderTitle, setSliderTitle] = React.useState("Home Page Slider");
  const [editingIndex, setEditingIndex] = React.useState(0);
  const [titleColor, setTitleColor] = React.useState("#9ea1f0");
  const [descriptionColor, setDescriptionColor] = React.useState("#53e7cf");
  const [backgroundColor, setBackgroundColor] = React.useState("#f19cf1");
  const [textColor, setTextColor] = React.useState("#d8f099");
  const [overlayOpacity, setOverlayOpacity] = React.useState(60);
  const [brightness, setBrightness] = React.useState(90);
  const [blur, setBlur] = React.useState(0);

  const editing = slides[editingIndex] ?? slides[0];

  const updateEditing = (patch: Partial<Slide>) => {
    setSlides((prev) =>
      prev.map((s, i) => (i === editingIndex ? { ...s, ...patch } : s)),
    );
  };

  // ── Left form ──────────────────────────────────────────────────────────────
const form = (
  <div className="rounded-[var(--vendor-radius-panel)]  bg-[var(--vendor-panel-bg)] ">
    {/* Header */}
    <div className="border-b border-[var(--vendor-border)] px-5 py-4">
      <h2 className="text-[16px] font-black text-[var(--vendor-text)]">Slide Settings</h2>
      <p className="mt-0.5 text-[12px] font-medium text-[var(--vendor-text-muted)]">
        Add and edit slide information for the homepage slider.
      </p>
    </div>

    <div className="space-y-5 p-5">
      {/* Slider Title */}
      <BuilderCountedInput
        label="Slider Title"
        value={sliderTitle}
        onChange={(v) => setSliderTitle(v)}
        maxLength={100}
      />

      {/* Slide Title */}
      <BuilderCountedInput
        label="Slide Title"
        value={editing.title}
        onChange={(v) => updateEditing({ title: v })}
        maxLength={100}
      />

      {/* Slide Description */}
      <BuilderCountedTextarea
        label="Slide Description"
        value={editing.description}
        onChange={(v) => updateEditing({ description: v })}
        maxLength={200}
        textareaClassName="min-h-[90px]"
      />

      {/* Button Label */}
      <BuilderCountedInput
        label="Button Label"
        value={editing.buttonLabel}
        onChange={(v) => updateEditing({ buttonLabel: v })}
        maxLength={30}
      />

      {/* Button Page */}
      <div className="space-y-1.5">
        <p className="text-[12px] font-bold text-[var(--vendor-text)]">Button Page</p>
        <Select
          value={editing.buttonPage}
          onValueChange={(v) => updateEditing({ buttonPage: v })}
        >
          <SelectTrigger className="h-9 w-full text-[13px] font-semibold">
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

      {/* Button Color */}
      <div className="space-y-1.5">
        <p className="text-[12px] font-bold text-[var(--vendor-text)]">Button Color</p>
        <ColorPickerInput
          value={editing.buttonColor}
          onChange={(color) => updateEditing({ buttonColor: color })}
        />
      </div>

      {/* Overlay / Brightness / Blur sliders */}
      <RangeSliderInput
        label="Overlay Opacity"
        value={overlayOpacity}
        onChange={setOverlayOpacity}
      />
      <RangeSliderInput
        label="Brightness"
        value={brightness}
        onChange={setBrightness}
      />
      <RangeSliderInput
        label="Blur"
        value={blur}
        onChange={setBlur}
        suffix="px"
      />

      {/* Color grid — 2×2 */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <div className="space-y-1.5">
          <p className="text-[12px] font-bold text-[var(--vendor-text)]">Title Color</p>
          <ColorPickerInput value={titleColor} onChange={setTitleColor} />
        </div>
        <div className="space-y-1.5">
          <p className="text-[12px] font-bold text-[var(--vendor-text)]">Description Color</p>
          <ColorPickerInput value={descriptionColor} onChange={setDescriptionColor} />
        </div>
        <div className="space-y-1.5">
          <p className="text-[12px] font-bold text-[var(--vendor-text)]">Background Color</p>
          <ColorPickerInput value={backgroundColor} onChange={setBackgroundColor} />
        </div>
        <div className="space-y-1.5">
          <p className="text-[12px] font-bold text-[var(--vendor-text)]">Text Color</p>
          <ColorPickerInput value={textColor} onChange={setTextColor} />
        </div>
      </div>

      {/* Slide Image */}
      <ImageUpload
        label="Slide Image"
        hint="Click to upload or drag and drop"
        recommendedSize="Recommended: 1920x800px (Max: 2MB)"
      />

      {/* Status */}
      <ToggleField
        label="Status"
        description="Enable or disable this slide."
        checked={editing.status}
        onCheckedChange={(v) => updateEditing({ status: v })}
        className="border-0 bg-transparent p-0"
      />
    </div>

    {/* Footer actions */}
    <div className="border-t border-[var(--vendor-border)] p-5">
      <FormActions
        saveLabel="Update Slide"
        onCancel={() => setEditingIndex(0)}
        layout="default"
      />
    </div>
  </div>
);

  return (
    <WebsiteBuilderLayout
      title="Advanced  Slider"
      form={form}
      preview={<SliderPreview slides={slides} activeIndex={editingIndex} />}
      previewTitle="Live Preview"
      previewSubtitle="This is how your Advanced  Slider will appear on the website."
      previewActions={
        <DesktopMobileToggle value={device} onChange={setDevice} />
      }
      saveLabel="Save Changes"
      contentClassName="xl:grid-cols-[minmax(320px,35fr)_minmax(0,65fr)]"
    />
  );
}
