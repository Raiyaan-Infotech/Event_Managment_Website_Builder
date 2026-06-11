"use client";
import * as React from "react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { ImageUpload } from "../_components/image-upload";
import { ColorPickerInput } from "../_components/color-picker-input";
import { ToggleField } from "../_components/toggle-field";
import { SliderManagementTable } from "../_components/slider-management-table";
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
import { List, SlidersHorizontal } from "lucide-react";
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
    <div className="space-y-3">
      <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">

      {/* ── Column 1: Slide Editor ── */}
      <div className="dense-builder-form flex flex-col gap-2 min-h-0 min-w-0">
        <FormSection
          title="Slide Editor"
          icon={<SlidersHorizontal className="h-4 w-4" />}
          subtitle="Edit the content and appearance of the slider."
          className={`${card} space-y-1.5`}
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
            textareaClassName="!min-h-[40px] !max-h-[40px] resize-none"
            className="space-y-0.5"
          />

          {/* Button Label + Page */}
          <div className="grid grid-cols-1 sm:grid-cols-2 items-end gap-2">
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
          </div>

          {/* Button Color + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 items-start gap-2">
            <div className="space-y-0.5">
              <label className="block">Button Color</label>
              <ColorPickerInput
                value={editing.buttonColor}
                onChange={(color) => updateEditing({ buttonColor: color })}
                compact
              />
            </div>
            <div className="space-y-0.5">
              <label className="block">Status</label>
              <div className="flex items-center justify-between rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] px-2 py-1">
                <span className="text-[9px] text-[var(--vendor-text-muted)]">Enable slide</span>
                <Switch
                  checked={editing.status}
                  onCheckedChange={(v) => updateEditing({ status: v })}
                />
              </div>
            </div>
          </div>

          {/* Slide Image */}
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

          {/* Actions */}
          <div className="border-t border-[var(--vendor-border)] pt-1.5">
            <FormActions
              saveLabel="Update Slide"
              onCancel={() => setEditingIndex(0)}
              onSave={handleSave}
              isSaving={isSaving}
              layout="between"
            />
          </div>
        </FormSection>
      </div>

      {/* ── Column 2: Slider Management Table ── */}
      <div className="dense-builder-form flex flex-col gap-2 min-h-0 min-w-0">
        <FormSection
          title="Slider Management"
          icon={<List className="h-4 w-4" />}
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
            onStatusChange={(row, enabled) => {
              setSlides((prev) =>
                prev.map((s) => (s.id === row.id ? { ...s, status: enabled } : s)),
              );
            }}
          />
        </FormSection>
      </div>
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
    />
  );
}