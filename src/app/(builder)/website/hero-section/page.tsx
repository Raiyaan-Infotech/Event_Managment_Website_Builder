"use client";

import * as React from "react";
import {
  Monitor,
  Move,
  Plus,
  Proportions,
  Smartphone,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { ImageUpload } from "../_components/image-upload";
import { ColorPickerInput } from "../_components/color-picker-input";
import { RangeSliderInput } from "../_components/range-slider-input";
import { ToggleField } from "../_components/toggle-field";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
  BuilderIconOptionGroup,
} from "../_components/builder-field";
import { RadioGroup } from "../_components/radio-group";
import { FormActions } from "../_components/form-actions";

type ButtonStyle = "Primary" | "Outline" | "Ghost";
type ButtonLayout = "left" | "center" | "right" | "space-between" | "stack";
type ContentAlign = "left" | "center" | "right";

interface CTAButton {
  enabled: boolean;
  label: string;
  link: string;
  style: ButtonStyle;
  color: string;
}

// Shared card className — ultra compact
const card = "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-2 shadow-sm";

export default function HeroSectionPage() {
  const [badgeText, setBadgeText] = React.useState("Best Event Management");
  const [title, setTitle] = React.useState("We Create Unforgettable Moments");
  const [description, setDescription] = React.useState(
    "From elegant weddings to corporate events, we handle every detail with creativity and perfection. Let us bring your dream event to life.",
  );
  const [btn1, setBtn1] = React.useState<CTAButton>({
    enabled: true, label: "Explore Events", link: "/events", style: "Primary", color: "#6C47FF",
  });
  const [btn2, setBtn2] = React.useState<CTAButton>({
    enabled: true, label: "Contact Us", link: "/contact", style: "Outline", color: "#FFFFFF",
  });
  const [buttonLayout, setButtonLayout] = React.useState<ButtonLayout>("left");
  const [contentAlign, setContentAlign] = React.useState<ContentAlign>("left");
  const [heroHeight, setHeroHeight] = React.useState("medium");
  const [overlayEnabled, setOverlayEnabled] = React.useState(true);
  const [overlayColor, setOverlayColor] = React.useState("#0B0D17");
  const [overlayOpacity, setOverlayOpacity] = React.useState(60);
  const [hideBtn2Mobile, setHideBtn2Mobile] = React.useState(false);
  const [centerMobile, setCenterMobile] = React.useState(true);
  const [mobileHeroHeight, setMobileHeroHeight] = React.useState("medium-500");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleCancel = () => {
    setBadgeText("Best Event Management");
    setTitle("We Create Unforgettable Moments");
    setDescription(
      "From elegant weddings to corporate events, we handle every detail with creativity and perfection. Let us bring your dream event to life.",
    );
    setBtn1({ enabled: true, label: "Explore Events", link: "/events", style: "Primary", color: "#6C47FF" });
    setBtn2({ enabled: true, label: "Contact Us", link: "/contact", style: "Outline", color: "#FFFFFF" });
    setButtonLayout("left");
    setContentAlign("left");
    setHeroHeight("medium");
    setOverlayEnabled(true);
    setOverlayColor("#0B0D17");
    setOverlayOpacity(60);
    setHideBtn2Mobile(false);
    setCenterMobile(true);
    setMobileHeroHeight("medium-500");
  };

  const form = (
    <div className="space-y-3">
      <div className="grid gap-2 grid-cols-1 lg:grid-cols-3">

      {/* ── Column 1: Hero Content + Layouts ── */}
      <div className="dense-builder-form flex flex-col gap-2 min-h-0 min-w-0">

        <FormSection
          title="Hero Content"
          icon={<Monitor className="h-4 w-4" />}
          subtitle="Text and media for the hero."
          className={`${card} space-y-1.5`}
        >
          <ImageUpload
            label="Hero Image"
            recommendedSize="1920x800px"
            maxFileSize="2MB"
          />
          <BuilderCountedInput
            label="Badge Text (Optional)"
            value={badgeText}
            onChange={setBadgeText}
            maxLength={50}
            className="space-y-0.5"
          />
          <BuilderCountedInput
            label="Title"
            required
            value={title}
            onChange={setTitle}
            maxLength={70}
            className="space-y-0.5"
          />
          <BuilderCountedTextarea
            label="Description"
            value={description}
            onChange={setDescription}
            maxLength={300}
            textareaClassName="!min-h-[48px] !max-h-[48px] resize-none"
            className="space-y-0.5"
          />
        </FormSection>

        <FormSection
          title="Button Layout"
          subtitle="How buttons are arranged."
          className={`${card} space-y-1`}
        >
          <BuilderIconOptionGroup
            value={buttonLayout}
            onChange={setButtonLayout}
            columns="5"
            options={[
              { value: "left", label: "Left", icon: (<svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor"><rect x="0" y="0" width="12" height="3" rx="1.5"/><rect x="0" y="5.5" width="20" height="3" rx="1.5"/><rect x="0" y="11" width="8" height="3" rx="1.5"/></svg>) },
              { value: "center", label: "Center", icon: (<svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor"><rect x="4" y="0" width="12" height="3" rx="1.5"/><rect x="0" y="5.5" width="20" height="3" rx="1.5"/><rect x="6" y="11" width="8" height="3" rx="1.5"/></svg>) },
              { value: "right", label: "Right", icon: (<svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor"><rect x="8" y="0" width="12" height="3" rx="1.5"/><rect x="0" y="5.5" width="20" height="3" rx="1.5"/><rect x="12" y="11" width="8" height="3" rx="1.5"/></svg>) },
              { value: "space-between", label: "Space", icon: (<svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor"><rect x="0" y="0" width="8" height="3" rx="1.5"/><rect x="12" y="0" width="8" height="3" rx="1.5"/><rect x="0" y="5.5" width="20" height="3" rx="1.5"/><rect x="0" y="11" width="20" height="3" rx="1.5"/></svg>) },
              { value: "stack", label: "Stack", icon: (<svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor"><rect x="2" y="0" width="16" height="3" rx="1.5"/><rect x="2" y="5.5" width="16" height="3" rx="1.5"/><rect x="2" y="11" width="16" height="3" rx="1.5"/></svg>) },
            ]}
          />
        </FormSection>

        <FormSection
          title="Content Alignment"
          subtitle="How text content is aligned."
          className={`${card} space-y-1`}
        >
          <BuilderIconOptionGroup
            value={contentAlign}
            onChange={setContentAlign}
            columns="3"
            options={[
              { value: "left", label: "Left", icon: (<svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor"><rect x="0" y="0" width="20" height="3" rx="1.5"/><rect x="0" y="5.5" width="14" height="3" rx="1.5"/><rect x="0" y="11" width="8" height="3" rx="1.5"/></svg>) },
              { value: "center", label: "Center", icon: (<svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor"><rect x="0" y="0" width="20" height="3" rx="1.5"/><rect x="3" y="5.5" width="14" height="3" rx="1.5"/><rect x="6" y="11" width="8" height="3" rx="1.5"/></svg>) },
              { value: "right", label: "Right", icon: (<svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor"><rect x="0" y="0" width="20" height="3" rx="1.5"/><rect x="6" y="5.5" width="14" height="3" rx="1.5"/><rect x="12" y="11" width="8" height="3" rx="1.5"/></svg>) },
            ]}
          />
        </FormSection>

      </div>

      {/* ── Column 2: CTA Buttons ── */}
      <div className="dense-builder-form flex flex-col gap-2 min-h-0 min-w-0">

        <FormSection
          title="Button 1 (Primary CTA)"
          icon={<Proportions className="h-4 w-4" />}
          actions={
            <Switch
              checked={btn1.enabled}
              onCheckedChange={(enabled) => setBtn1((prev) => ({ ...prev, enabled }))}
            />
          }
          className={`${card} space-y-1.5`}
        >
          <BuilderCountedInput label="Label" value={btn1.label} onChange={(label) => setBtn1((p) => ({ ...p, label }))} maxLength={30} className="space-y-0.5" />
          <BuilderCountedInput label="Link" value={btn1.link} onChange={(link) => setBtn1((p) => ({ ...p, link }))} maxLength={100} className="space-y-0.5" />
          <div className="grid grid-cols-[1fr_34px] gap-1.5">
            <div className="min-w-0 space-y-0.5">
              <p className="text-[9px] font-semibold text-[var(--vendor-text)]">Style</p>
              <Select value={btn1.style} onValueChange={(style) => setBtn1((p) => ({ ...p, style: style as ButtonStyle }))}>
                <SelectTrigger className="h-6 px-2 text-[9px] font-semibold"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primary">Primary</SelectItem>
                  <SelectItem value="Outline">Outline</SelectItem>
                  <SelectItem value="Ghost">Ghost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-semibold text-[var(--vendor-text)]">Color</p>
              <ColorPickerInput value={btn1.color} onChange={(color) => setBtn1((p) => ({ ...p, color }))} compact />
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Button 2 (Optional CTA)"
          actions={
            <Switch
              checked={btn2.enabled}
              onCheckedChange={(enabled) => setBtn2((prev) => ({ ...prev, enabled }))}
            />
          }
          className={`${card} space-y-1.5`}
        >
          <BuilderCountedInput label="Label" value={btn2.label} onChange={(label) => setBtn2((p) => ({ ...p, label }))} maxLength={30} className="space-y-0.5" />
          <BuilderCountedInput label="Link" value={btn2.link} onChange={(link) => setBtn2((p) => ({ ...p, link }))} maxLength={100} className="space-y-0.5" />
          <div className="grid grid-cols-[1fr_34px] gap-1.5">
            <div className="min-w-0 space-y-0.5">
              <p className="text-[9px] font-semibold text-[var(--vendor-text)]">Style</p>
              <Select value={btn2.style} onValueChange={(style) => setBtn2((p) => ({ ...p, style: style as ButtonStyle }))}>
                <SelectTrigger className="h-6 px-2 text-[9px] font-semibold"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Primary">Primary</SelectItem>
                  <SelectItem value="Outline">Outline</SelectItem>
                  <SelectItem value="Ghost">Ghost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-semibold text-[var(--vendor-text)]">Color</p>
              <ColorPickerInput value={btn2.color} onChange={(color) => setBtn2((p) => ({ ...p, color }))} compact />
            </div>
          </div>
        </FormSection>
      </div>

      {/* ── Column 3: Hero Height + Overlay + Mobile ── */}
      <div className="dense-builder-form flex flex-col gap-2 min-h-0 min-w-0">

        <FormSection
          title="Hero Height"
          icon={<Move className="h-4 w-4" />}
          subtitle="Set the height of the hero section."
          className={`${card} space-y-1`}
        >
          <RadioGroup
            value={heroHeight}
            onChange={setHeroHeight}
            options={[
              { label: "Small (400px)", value: "small" },
              { label: "Medium (600px)", value: "medium" },
              { label: "Large (800px)", value: "large" },
              { label: "Full Screen", value: "fullscreen" },
            ]}
          />
        </FormSection>

        <FormSection
          title="Overlay Settings"
          subtitle="Improve text readability."
          className={`${card} space-y-1.5`}
        >
          <ToggleField
            label="Enable Overlay"
            checked={overlayEnabled}
            onCheckedChange={setOverlayEnabled}
            className="border-0 bg-transparent p-0"
          />
          <div className="space-y-0.5">
            <p className="text-[9px] font-semibold text-[var(--vendor-text)]">Overlay Color</p>
            <ColorPickerInput value={overlayColor} onChange={setOverlayColor} />
          </div>
          <RangeSliderInput label="Overlay Opacity" value={overlayOpacity} onChange={setOverlayOpacity} />
        </FormSection>

        <FormSection
          title="Mobile Settings"
          icon={<Smartphone className="h-4 w-4" />}
          subtitle="Customize for mobile devices."
          className={`${card} space-y-1.5`}
        >
          <ToggleField label="Hide Button 2 on Mobile" checked={hideBtn2Mobile} onCheckedChange={setHideBtn2Mobile} className="border-0 bg-transparent p-0" />
          <ToggleField label="Center Content on Mobile" checked={centerMobile} onCheckedChange={setCenterMobile} className="border-0 bg-transparent p-0" />
          <div className="space-y-0.5">
            <p className="text-[9px] font-semibold text-[var(--vendor-text)]">Mobile Hero Height</p>
            <Select value={mobileHeroHeight} onValueChange={setMobileHeroHeight}>
              <SelectTrigger className="h-6 px-2 text-[9px] font-semibold"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="small-300">Small (300px)</SelectItem>
                <SelectItem value="medium-500">Medium (500px)</SelectItem>
                <SelectItem value="large-700">Large (700px)</SelectItem>
                <SelectItem value="fullscreen">Full Screen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FormSection>

      </div>
    </div>
  </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Hero Section"
      form={form}
      saveLabel="Save Changes"
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
      leftClassName="border-0 bg-transparent p-0 shadow-none overflow-y-auto"
    />
  );
}