"use client";
import * as React from "react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
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
  overlayOpacity,
  brightness,
  blur,
  titleColor,
  descriptionColor,
  buttonTextColor,
  onAddSlide,
  onEditSlide,
  onDeleteSlide,
  onStatusChange,
}: {
  slides: Slide[];
  activeIndex: number;
  overlayOpacity: number;
  brightness: number;
  blur: number;
  titleColor: string;
  descriptionColor: string;
  buttonTextColor: string;
  onAddSlide: () => void;
  onEditSlide: (index: number) => void;
  onDeleteSlide: (id: string) => void;
  onStatusChange: (id: string, enabled: boolean) => void;
}) {
  const [current, setCurrent] = React.useState(activeIndex);

  React.useEffect(() => setCurrent(activeIndex), [activeIndex]);

  return (
    <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-slate-950 shadow-sm">
      {/* Slide area */}
      <div className="relative min-h-[210px] overflow-hidden">
        {/* Gradient background placeholder */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(135deg,#1a0a2e,#6b2fa0_40%,#1a1035)]" 
          style={{
            filter: `brightness(${brightness}%) blur(${blur}px)`,
          }}
        />

        {/* Slide image if uploaded */}
        {slides[current]?.imageUrl && (
          <img 
            src={slides[current].imageUrl} 
            alt="Slide Background" 
            className="absolute inset-0 w-full h-full object-cover animate-fade-in"
            style={{
              filter: `brightness(${brightness}%) blur(${blur}px)`,
            }}
          />
        )}

        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black" 
          style={{ opacity: overlayOpacity / 100 }}
        />

        {/* Content */}
        <div className="relative flex min-h-[210px] flex-col justify-center px-6 py-6 text-white z-10">
          <h2 
            className="max-w-lg text-[22px] font-black leading-tight tracking-tight"
            style={{ color: titleColor }}
          >
            {slides[current]?.title || "Slide Title"}
          </h2>
          <p 
            className="mt-2 max-w-md text-[12px] font-medium leading-5"
            style={{ color: descriptionColor }}
          >
            {slides[current]?.description || "Slide description goes here."}
          </p>
          <div className="mt-4">
            <button
              className="rounded-[var(--vendor-radius-control)] px-4 py-2 text-xs font-bold h-8 flex items-center justify-center transition-transform hover:scale-105"
              style={{
                backgroundColor: slides[current]?.buttonColor ?? "#6C47FF",
                color: buttonTextColor || "#FFFFFF",
              }}
            >
              {slides[current]?.buttonLabel || "Button"}
            </button>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          type="button"
          onClick={() => {
            const nextIdx = (current - 1 + slides.length) % slides.length;
            setCurrent(nextIdx);
            onEditSlide(nextIdx);
          }}
          className="absolute left-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 z-20 transition-colors"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            const nextIdx = (current + 1) % slides.length;
            setCurrent(nextIdx);
            onEditSlide(nextIdx);
          }}
          className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 z-20 transition-colors"
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setCurrent(i);
                onEditSlide(i);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === current ? "w-4.5 bg-white" : "w-1.5 bg-white/40",
              )}
            />
          ))}
        </div>
      </div>

      {/* Slider Management */}
      <div className="bg-white p-3">
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
          onAdd={onAddSlide}
          onEdit={(row) => {
            const nextIndex = slides.findIndex((slide) => slide.id === row.id);
            if (nextIndex >= 0) {
              setCurrent(nextIndex);
              onEditSlide(nextIndex);
            }
          }}
          onDelete={(row) => onDeleteSlide(row.id.toString())}
          onStatusChange={(row, enabled) => onStatusChange(row.id.toString(), enabled)}
        />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdvancedSliderPage() {
  const [device, setDevice] = React.useState<PreviewDevice>("desktop");
  const [slides, setSlides] = React.useState<Slide[]>(initialSlides);
  const [sliderTitle, setSliderTitle] = React.useState("Home Page Advanced Slider");
  const [editingIndex, setEditingIndex] = React.useState(0);
  const [titleColor, setTitleColor] = React.useState("#FFFFFF");
  const [descriptionColor, setDescriptionColor] = React.useState("#E6E6E6");
  const [textColor, setTextColor] = React.useState("#FFFFFF"); // Button text color
  const [overlayOpacity, setOverlayOpacity] = React.useState(60);
  const [brightness, setBrightness] = React.useState(90);
  const [blur, setBlur] = React.useState(0);
  const [isSaving, setIsSaving] = React.useState(false);

  const editing = slides[editingIndex] ?? slides[0];

  const updateEditing = (patch: Partial<Slide>) => {
    setSlides((prev) =>
      prev.map((s, i) => (i === editingIndex ? { ...s, ...patch } : s)),
    );
  };

  const onAddSlide = () => {
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
  };

  const onDeleteSlide = (id: string) => {
    if (slides.length <= 1) return; // keep at least one
    setSlides((prev) => prev.filter((s) => s.id !== id));
    setEditingIndex(0);
  };

  const onStatusChange = (id: string, enabled: boolean) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: enabled } : s)),
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Changes saved successfully!");
    }, 800);
  };

  // ── Left Form (All Content & Visual Settings) ──────────────────────────────
  const form = (
    <div className="dense-builder-form p-1">
      {/* Title & Subtitle */}
      <div className="mb-0.5">
        <h2 className="text-[12px] font-black text-[var(--vendor-text)]">Slide Content</h2>
        <p className="text-[9.5px] font-medium text-[var(--vendor-text-muted)]">
          Manage text contents for the home page slider.
        </p>
      </div>

      {/* Fields */}
      <div className="space-y-1.5">
        <BuilderCountedInput
          label="1. Slider Title"
          value={sliderTitle}
          onChange={(v) => setSliderTitle(v)}
          maxLength={100}
          className="space-y-0.5"
        />
        <BuilderCountedInput
          label="2. Slide Title"
          value={editing.title}
          onChange={(v) => updateEditing({ title: v })}
          maxLength={100}
          className="space-y-0.5"
        />
        <BuilderCountedTextarea
          label="3. Slide Description"
          value={editing.description}
          onChange={(v) => updateEditing({ description: v })}
          maxLength={200}
          textareaClassName="min-h-[44px]"
          className="space-y-0.5"
        />
        <BuilderCountedInput
          label="4. Button Label"
          value={editing.buttonLabel}
          onChange={(v) => updateEditing({ buttonLabel: v })}
          maxLength={30}
          className="space-y-0.5"
        />
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-[var(--vendor-text)]">5. Button Page</p>
          <Select
            value={editing.buttonPage}
            onValueChange={(v) => updateEditing({ buttonPage: v })}
          >
            <SelectTrigger className="h-7 w-full text-[9.5px] font-semibold SelectTrigger">
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

        {/* Overlay & Effects Section */}
        <div className="pt-1.5 border-t border-[var(--vendor-border)]">
          <h3 className="text-[10px] font-extrabold text-[var(--vendor-text)] mb-1">Overlay & Effects</h3>
          <div className="space-y-1">
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

        {/* Colors Section */}
        <div className="pt-1.5 border-t border-[var(--vendor-border)]">
          <h3 className="text-[10px] font-extrabold text-[var(--vendor-text)] mb-1">Colors</h3>
          <div className="grid grid-cols-2 gap-2">
            <ColorPickerInput label="9. Title Color" value={titleColor} onChange={setTitleColor} compact={true} />
            <ColorPickerInput label="10. Description Color" value={descriptionColor} onChange={setDescriptionColor} compact={true} />
          </div>
        </div>

        {/* Button Settings Section */}
        <div className="pt-1.5 border-t border-[var(--vendor-border)]">
          <h3 className="text-[10px] font-extrabold text-[var(--vendor-text)] mb-1">Button Settings</h3>
          <div className="grid grid-cols-2 gap-2">
            <ColorPickerInput
              label="11. Background Color"
              value={editing.buttonColor}
              onChange={(color) => updateEditing({ buttonColor: color })}
              compact={true}
            />
            <ColorPickerInput label="12. Text Color" value={textColor} onChange={setTextColor} compact={true} />
          </div>
        </div>

        {/* Slide Image Section */}
        <div className="pt-1.5 border-t border-[var(--vendor-border)]">
          <h3 className="text-[10px] font-extrabold text-[var(--vendor-text)] mb-1">Slide Image</h3>
          <ImageUpload
            compact={true}
            title="Click to upload"
            browseText="or drag and drop"
            hint="Recommended: 1920x800px (Max: 2MB)"
            size="wide"
            value={editing.imageUrl}
            onFileSelect={(file) => {
              const url = URL.createObjectURL(file);
              updateEditing({ imageUrl: url });
            }}
            onRemove={() => {
              updateEditing({ imageUrl: "" });
            }}
          />
        </div>

        {/* Status Section */}
        <div className="pt-1.5 border-t border-[var(--vendor-border)]">
          <ToggleField
            label="Status"
            description="Enable or disable this slide."
            checked={editing.status}
            onCheckedChange={(v) => updateEditing({ status: v })}
            className="border-0 bg-transparent p-0"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-[var(--vendor-border)]">
          <FormActions
            saveLabel="Update Slide"
            onCancel={() => setEditingIndex(0)}
            onSave={handleSave}
            isSaving={isSaving}
            layout="default"
          />
        </div>
      </div>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Advanced Slider"
      form={form}
      preview={
        <SliderPreview 
          slides={slides} 
          activeIndex={editingIndex}
          overlayOpacity={overlayOpacity}
          brightness={brightness}
          blur={blur}
          titleColor={titleColor}
          descriptionColor={descriptionColor}
          buttonTextColor={textColor}
          onAddSlide={onAddSlide}
          onEditSlide={setEditingIndex}
          onDeleteSlide={onDeleteSlide}
          onStatusChange={onStatusChange}
        />
      }
      previewTitle="Live Preview"
      previewSubtitle="This is how your Advanced Slider will appear on the website."
      previewActions={
        <DesktopMobileToggle value={device} onChange={setDevice} />
      }
      saveLabel="Save Changes"
      contentClassName="xl:grid-cols-[380px_1fr]"
      onSave={handleSave}
      isSaving={isSaving}
    />
  );
}
