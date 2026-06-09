"use client";
import * as React from "react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
          onClick={() =>
            setCurrent((p) => (p + 1) % slides.length)
          }
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
                i === current
                  ? "w-6 bg-white"
                  : "w-2 bg-white/40",
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
export default function SimpleSliderPage() {
  const [device, setDevice] = React.useState<PreviewDevice>("desktop");
  const [slides, setSlides] = React.useState<Slide[]>(initialSlides);
  const [sliderTitle, setSliderTitle] = React.useState("Home Page Slider");
  const [editingIndex, setEditingIndex] = React.useState(0);

  const editing = slides[editingIndex] ?? slides[0];

  const updateEditing = (patch: Partial<Slide>) => {
    setSlides((prev) =>
      prev.map((s, i) => (i === editingIndex ? { ...s, ...patch } : s)),
    );
  };

  // ── Left form ──────────────────────────────────────────────────────────────
  const form = (
    <div className="space-y-2">
      {/* Header */}
      <div>
        <h2 className="text-[13px] font-black text-[var(--vendor-text)]">Slide Settings</h2>
        <p className="mt-0.5 text-[11px] text-[var(--vendor-text-muted)]">
          Add and edit slide information for the homepage slider.
        </p>
      </div>

      {/* Slider Title & Slide Title side-by-side */}
      <div className="grid grid-cols-2 gap-3">
        <BuilderCountedInput
          label="Slider Title"
          value={sliderTitle}
          onChange={(v) => setSliderTitle(v)}
          maxLength={100}
        />
        <BuilderCountedInput
          label="Slide Title"
          value={editing.title}
          onChange={(v) => updateEditing({ title: v })}
          maxLength={100}
        />
      </div>

      {/* Slide Description */}
      <BuilderCountedTextarea
        label="Slide Description"
        value={editing.description}
        onChange={(v) => updateEditing({ description: v })}
        maxLength={200}
      />

      {/* Button Label & Page */}
      <div className="grid grid-cols-2 gap-3">
        <BuilderCountedInput
          label="Button Label"
          value={editing.buttonLabel}
          onChange={(v) => updateEditing({ buttonLabel: v })}
          maxLength={30}
        />

        <div className="space-y-1">
          <p className="text-[10px] font-semibold text-[var(--vendor-text)]">
            Button Page
          </p>
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
      </div>

      {/* Button Color & Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold text-[var(--vendor-text)]">
            Button Color
          </p>
          <ColorPickerInput
            value={editing.buttonColor}
            onChange={(color) => updateEditing({ buttonColor: color })}
          />
        </div>

        <ToggleField
          label="Status"
          description="Enable/disable slide"
          checked={editing.status}
          onCheckedChange={(v) => updateEditing({ status: v })}
          className="border-0 bg-transparent p-0 flex items-center justify-between h-9 mt-4"
        />
      </div>

      {/* Slide Image - side-by-side uploader and preview */}
      <div className="space-y-1">
        <p className="text-[10px] font-semibold text-[var(--vendor-text)]">Slide Image</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative h-[74px] w-[92px] overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-slate-100 flex items-center justify-center">
            {editing.imageUrl ? (
              <>
                <img src={editing.imageUrl} alt="Slide preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => updateEditing({ imageUrl: "" })}
                  className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-rose-500"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </>
            ) : (
              <span className="text-[9px] text-slate-400 font-semibold">No Image</span>
            )}
          </div>
          <ImageUpload
            compact
            size="sm"
            onFileSelect={(file) => {
              const url = URL.createObjectURL(file);
              updateEditing({ imageUrl: url });
            }}
            onRemove={() => updateEditing({ imageUrl: "" })}
          />
        </div>
      </div>

      {/* Footer actions */}
      <div className="pt-2">
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
      title="Simple Slider"
      form={form}
      preview={
        <SliderPreview
          slides={slides}
          activeIndex={editingIndex}
        />
      }
      previewTitle="Live Preview"
      previewSubtitle="This is how your slider will appear on the website."
      previewActions={
        <DesktopMobileToggle value={device} onChange={setDevice} />
      }
      saveLabel="Save Changes"
      contentClassName="xl:grid-cols-[minmax(320px,35fr)_minmax(0,65fr)]"
    />
  );
}
