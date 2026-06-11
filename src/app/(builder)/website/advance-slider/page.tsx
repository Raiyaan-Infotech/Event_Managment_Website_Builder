"use client";
import * as React from "react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { ImageUpload } from "../_components/image-upload";
import { ColorPickerInput } from "../_components/color-picker-input";
import { ToggleField } from "../_components/toggle-field";
import { SliderManagementTable } from "../_components/slider-management-table";
import { BuilderCountedInput, BuilderCountedTextarea } from "../_components/builder-field";
import { RangeSliderInput } from "../_components/range-slider-input";
import { FormActions } from "../_components/form-actions";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AlignLeft, Info, Layers, SlidersHorizontal, Sparkles, Wand2 } from "lucide-react";

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
    description: "From elegant weddings to corporate events, we handle every detail with creativity and perfection. Let us bring your dream event to life.",
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

const card = "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm";

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function AdvancedSliderPage() {
  const [slides, setSlides] = React.useState<Slide[]>(initialSlides);
  const [sliderTitle, setSliderTitle] = React.useState("Home Page Advanced Slider");
  const [editingIndex, setEditingIndex] = React.useState(0);
  const [titleColor, setTitleColor] = React.useState("#FFFFFF");
  const [descriptionColor, setDescriptionColor] = React.useState("#E6E6E6");
  const [overlayOpacity, setOverlayOpacity] = React.useState(60);
  const [brightness, setBrightness] = React.useState(90);
  const [blur, setBlur] = React.useState(0);
  const [isSaving, setIsSaving] = React.useState(false);

  const editing = slides[editingIndex] ?? slides[0];

  const updateEditing = (patch: Partial<Slide>) =>
    setSlides((prev) => prev.map((s, i) => (i === editingIndex ? { ...s, ...patch } : s)));

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
    <div className="space-y-3">
      {/* Outer grid: 2 columns on lg+ screens */}
      <div className="grid gap-3 grid-cols-1 lg:grid-cols-12 items-start">

        {/* ── Column 1: Slide Editor Settings (lg:col-span-7 xl:col-span-8) ── */}
        <div className="lg:col-span-7 xl:col-span-8 dense-builder-form flex flex-col gap-3 min-h-0">
          
          {/* Sub-grid of editor cards: 2 columns on sm+ screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Card 1: Slide Text Settings */}
            <FormSection
              title="1. Slide Text Settings"
              icon={<AlignLeft className="h-4 w-4" />}
              subtitle="Add and manage the text content for your slider."
              className={`${card} space-y-2`}
            >
              <BuilderCountedInput
                label="Slider Title"
                value={sliderTitle}
                onChange={setSliderTitle}
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
                textareaClassName="!min-h-[52px] !max-h-[52px] resize-none"
                className="space-y-0.5"
              />
            </FormSection>

            {/* Card 2: Button Configuration */}
            <FormSection
              title="2. Button Configuration"
              icon={<Wand2 className="h-4 w-4" />}
              subtitle="Customize the button on your slider."
              className={`${card} space-y-2`}
            >
              <BuilderCountedInput
                label="Button Label"
                value={editing.buttonLabel}
                onChange={(v) => updateEditing({ buttonLabel: v })}
                maxLength={30}
                className="space-y-0.5"
              />
              <div className="space-y-0.5">
                <label className="block">Button Page</label>
                <Select
                  value={editing.buttonPage}
                  onValueChange={(v) => updateEditing({ buttonPage: v })}
                >
                  <SelectTrigger className="h-6 w-full text-[9px] px-2 font-semibold">
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
              <div className="grid grid-cols-2 gap-2">
                <ColorPickerInput
                  label="Button Background"
                  value={editing.buttonColor}
                  onChange={(color) => updateEditing({ buttonColor: color })}
                  compact
                />
                <ColorPickerInput
                  label="Button Text Color"
                  value={editing.buttonTextColor}
                  onChange={(color) => updateEditing({ buttonTextColor: color })}
                  compact
                />
              </div>
            </FormSection>

            {/* Card 3: Overlay & Visual Effects */}
            <FormSection
              title="3. Overlay & Visual Effects"
              icon={<SlidersHorizontal className="h-4 w-4" />}
              subtitle="Adjust overlay and visual appearance."
              className={`${card} space-y-2`}
            >
              <RangeSliderInput label="Overlay Opacity" value={overlayOpacity} onChange={setOverlayOpacity} />
              <RangeSliderInput label="Brightness" value={brightness} onChange={setBrightness} />
              <RangeSliderInput label="Blur" value={blur} onChange={setBlur} suffix="px" />
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[var(--vendor-border)]">
                <ColorPickerInput label="Title Color" value={titleColor} onChange={setTitleColor} compact />
                <ColorPickerInput label="Description Color" value={descriptionColor} onChange={setDescriptionColor} compact />
              </div>
            </FormSection>

            {/* Card 4: Slide Image & Status */}
            <FormSection
              title="4. Slide Image & Status"
              icon={<Layers className="h-4 w-4" />}
              subtitle="Upload slide image and manage its status."
              className={`${card} space-y-2`}
            >
              <div className="space-y-2">
                <ImageUpload
                  label="Slide Image"
                  value={editing.imageUrl}
                  recommendedSize="1920x800px"
                  maxFileSize="2MB"
                  onFileSelect={(file) => updateEditing({ imageUrl: URL.createObjectURL(file) })}
                  onRemove={() => updateEditing({ imageUrl: "" })}
                />
                <ToggleField
                  label="Status"
                  description="Enable or disable this slide on the website."
                  checked={editing.status}
                  onCheckedChange={(v) => updateEditing({ status: v })}
                  className="border border-[var(--vendor-border)] bg-slate-50/60 px-2 py-1.5 rounded-[var(--vendor-radius-control)]"
                />
              </div>
            </FormSection>

          </div>

          {/* Card 5: Tip */}
          <div className={`${card} flex flex-col gap-2`}>
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[hsl(228_64%_96%)] text-[#2457d6]">
                <Info className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[var(--vendor-text)]">Tip</p>
                <p className="mt-0.5 text-[10px] text-[var(--vendor-text-muted)]">
                  Changes you make here will be reflected on your website.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ── Column 2: Slider Management (lg:col-span-5 xl:col-span-4) ── */}
        <div className="lg:col-span-5 xl:col-span-4 min-h-0 w-full">
          <FormSection
            title="Slider Management"
            icon={<Sparkles className="h-4 w-4" />}
            subtitle="Add, reorder, or remove slides."
            className={`${card} space-y-2`}
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
                setSlides((prev) => [...prev, {
                  id: nextId,
                  title: "New slide title",
                  description: "Describe what this slide is about.",
                  buttonLabel: "Learn More",
                  buttonPage: "home",
                  buttonColor: "#6C47FF",
                  buttonTextColor: "#FFFFFF",
                  imageUrl: "",
                  status: true,
                }]);
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
              onStatusChange={(row, enabled) =>
                setSlides((prev) => prev.map((s) => (s.id === row.id ? { ...s, status: enabled } : s)))
              }
            />
          </FormSection>
        </div>

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