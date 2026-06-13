"use client";

import * as React from "react";
import { PlayCircle } from "lucide-react";
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
  BuilderLabel,
  BuilderSelectField,
} from "../_components/builder-field";
import { RadioGroup } from "../_components/radio-group";
import {
  DesktopMobileToggle,
  type PreviewDevice,
} from "../_components/desktop-mobile-toggle";

type ButtonStyle  = "Primary" | "Outline" | "Ghost";
type ButtonLayout = "left" | "center" | "right" | "space-between" | "stack";
type ContentAlign = "left" | "center" | "right";

interface CTAButton {
  enabled: boolean;
  label: string;
  link: string;
  style: ButtonStyle;
  color: string;
}

const card =
  "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm";

const buttonStyleOptions: Array<{ label: string; value: ButtonStyle }> = [
  { label: "Primary", value: "Primary" },
  { label: "Outline", value: "Outline" },
  { label: "Ghost",   value: "Ghost"   },
];

const buttonLinkOptions: Array<{ label: string; value: string }> = [
  { label: "/home",     value: "/home"     },
  { label: "/about",    value: "/about"    },
  { label: "/services", value: "/services" },
  { label: "/events",   value: "/events"   },
  { label: "/gallery",  value: "/gallery"  },
  { label: "/contact",  value: "/contact"  },
  { label: "/book-now", value: "/book-now" },
];

interface ButtonColorFieldProps {
  value: string;
  onChange: (value: string) => void;
}

function ButtonColorField({ value, onChange }: ButtonColorFieldProps) {
  return (
    <div className="w-full space-y-1">
      <BuilderLabel>Color</BuilderLabel>
      <ColorPickerInput
        value={value}
        onChange={onChange}
        className="space-y-0 [&>div]:h-8 [&>div]:sm:h-9"
      />
    </div>
  );
}

export default function HeroSectionPage() {
  const [badgeText, setBadgeText]     = React.useState("Best Event Management");
  const [title, setTitle]             = React.useState("We Create Unforgettable Moments");
  const [description, setDescription] = React.useState(
    "From elegant weddings to corporate events, we handle every detail with creativity and perfection. Let us bring your dream event to life.",
  );
  const [btn1, setBtn1] = React.useState<CTAButton>({
    enabled: true, label: "Explore Events", link: "/events", style: "Primary", color: "#6C47FF",
  });
  const [btn2, setBtn2] = React.useState<CTAButton>({
    enabled: true, label: "Contact Us", link: "/contact", style: "Outline", color: "#FFFFFF",
  });
  const [buttonLayout, setButtonLayout]         = React.useState<ButtonLayout>("left");
  const [contentAlign, setContentAlign]         = React.useState<ContentAlign>("left");
  const [heroHeight, setHeroHeight]             = React.useState("medium");
  const [overlayEnabled, setOverlayEnabled]     = React.useState(true);
  const [overlayColor, setOverlayColor]         = React.useState("#0B0D17");
  const [overlayOpacity, setOverlayOpacity]     = React.useState(60);
  const [hideBtn2Mobile, setHideBtn2Mobile]     = React.useState(false);
  const [centerMobile, setCenterMobile]         = React.useState(true);
  const [mobileHeroHeight, setMobileHeroHeight] = React.useState("medium-500");
  const [previewDevice, setPreviewDevice]       = React.useState<PreviewDevice>("desktop");
  const [isSaving, setIsSaving]                 = React.useState(false);

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
    setBtn2({ enabled: true, label: "Contact Us",     link: "/contact", style: "Outline", color: "#FFFFFF" });
    setButtonLayout("left");
    setContentAlign("left");
    setHeroHeight("medium");
    setOverlayEnabled(true);
    setOverlayColor("#0B0D17");
    setOverlayOpacity(60);
    setHideBtn2Mobile(false);
    setCenterMobile(true);
    setMobileHeroHeight("medium-500");
    setPreviewDevice("desktop");
  };

  const form = (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-3">

      {/* ══ LEFT COLUMN ══════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-3">

        {/* Hero Content */}
        <FormSection title="Hero Content" className={`${card} space-y-2`}>
          <ImageUpload
            label="Hero Image"
            recommendedSize="1920x1080px or higher. Max 2MB."
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
            textareaClassName="!min-h-[72px] !max-h-[72px] resize-none"
            className="space-y-0.5"
          />
        </FormSection>

        {/* Button 1 */}
        <FormSection
          title="Button 1 (Primary CTA)"
          actions={
            <Switch
              checked={btn1.enabled}
              onCheckedChange={(enabled) => setBtn1((p) => ({ ...p, enabled }))}
            />
          }
          className={`${card} space-y-2`}
        >
          <div className="grid grid-cols-4 items-start gap-2">
            <BuilderCountedInput
              label="Label"
              value={btn1.label}
              onChange={(label) => setBtn1((p) => ({ ...p, label }))}
              maxLength={30}
              className="space-y-0.5"
            />
            <BuilderSelectField<string>
              label="Link"
              value={btn1.link}
              onChange={(link) => setBtn1((p) => ({ ...p, link }))}
              options={buttonLinkOptions}
            />
            <BuilderSelectField<ButtonStyle>
              label="Style"
              value={btn1.style}
              onChange={(style) => setBtn1((p) => ({ ...p, style }))}
              options={buttonStyleOptions}
            />
            <ButtonColorField
              value={btn1.color}
              onChange={(color) => setBtn1((p) => ({ ...p, color }))}
            />
          </div>
        </FormSection>

        {/* Button 2 */}
        <FormSection
          title="Button 2 (Optional CTA)"
          actions={
            <Switch
              checked={btn2.enabled}
              onCheckedChange={(enabled) => setBtn2((p) => ({ ...p, enabled }))}
            />
          }
          className={`${card} space-y-2`}
        >
          <div className="grid grid-cols-4 items-start gap-2">
            <BuilderCountedInput
              label="Label"
              value={btn2.label}
              onChange={(label) => setBtn2((p) => ({ ...p, label }))}
              maxLength={30}
              className="space-y-0.5"
            />
            <BuilderSelectField<string>
              label="Link"
              value={btn2.link}
              onChange={(link) => setBtn2((p) => ({ ...p, link }))}
              options={buttonLinkOptions}
            />
            <BuilderSelectField<ButtonStyle>
              label="Style"
              value={btn2.style}
              onChange={(style) => setBtn2((p) => ({ ...p, style }))}
              options={buttonStyleOptions}
            />
            <ButtonColorField
              value={btn2.color}
              onChange={(color) => setBtn2((p) => ({ ...p, color }))}
            />
          </div>
        </FormSection>

        {/* Button Layout */}
        <FormSection
          title="Button Layout"
          subtitle="How buttons are arranged."
          className={`${card} space-y-2`}
        >
          <BuilderIconOptionGroup
            value={buttonLayout}
            onChange={setButtonLayout}
            columns="5"
            options={[
              {
                value: "left",
                label: "Left",
                icon: (
                  <svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor">
                    <rect x="0"  y="0"   width="12" height="3" rx="1.5"/>
                    <rect x="0"  y="5.5" width="20" height="3" rx="1.5"/>
                    <rect x="0"  y="11"  width="8"  height="3" rx="1.5"/>
                  </svg>
                ),
              },
              {
                value: "center",
                label: "Center",
                icon: (
                  <svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor">
                    <rect x="4"  y="0"   width="12" height="3" rx="1.5"/>
                    <rect x="0"  y="5.5" width="20" height="3" rx="1.5"/>
                    <rect x="6"  y="11"  width="8"  height="3" rx="1.5"/>
                  </svg>
                ),
              },
              {
                value: "right",
                label: "Right",
                icon: (
                  <svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor">
                    <rect x="8"  y="0"   width="12" height="3" rx="1.5"/>
                    <rect x="0"  y="5.5" width="20" height="3" rx="1.5"/>
                    <rect x="12" y="11"  width="8"  height="3" rx="1.5"/>
                  </svg>
                ),
              },
              {
                value: "space-between",
                label: "Space Between",
                icon: (
                  <svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor">
                    <rect x="0"  y="0"   width="8"  height="3" rx="1.5"/>
                    <rect x="12" y="0"   width="8"  height="3" rx="1.5"/>
                    <rect x="0"  y="5.5" width="20" height="3" rx="1.5"/>
                    <rect x="0"  y="11"  width="20" height="3" rx="1.5"/>
                  </svg>
                ),
              },
              {
                value: "stack",
                label: "Stack Vertical",
                icon: (
                  <svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor">
                    <rect x="2" y="0"   width="16" height="3" rx="1.5"/>
                    <rect x="2" y="5.5" width="16" height="3" rx="1.5"/>
                    <rect x="2" y="11"  width="16" height="3" rx="1.5"/>
                  </svg>
                ),
              },
            ]}
          />
        </FormSection>

        {/* Content Alignment */}
        <FormSection
          title="Content Alignment"
          subtitle="How text content is aligned."
          className={`${card} space-y-2`}
        >
          <BuilderIconOptionGroup
            value={contentAlign}
            onChange={setContentAlign}
            columns="3"
            options={[
              {
                value: "left",
                label: "Left",
                icon: (
                  <svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor">
                    <rect x="0" y="0"   width="20" height="3" rx="1.5"/>
                    <rect x="0" y="5.5" width="14" height="3" rx="1.5"/>
                    <rect x="0" y="11"  width="8"  height="3" rx="1.5"/>
                  </svg>
                ),
              },
              {
                value: "center",
                label: "Center",
                icon: (
                  <svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor">
                    <rect x="0" y="0"   width="20" height="3" rx="1.5"/>
                    <rect x="3" y="5.5" width="14" height="3" rx="1.5"/>
                    <rect x="6" y="11"  width="8"  height="3" rx="1.5"/>
                  </svg>
                ),
              },
              {
                value: "right",
                label: "Right",
                icon: (
                  <svg width="18" height="12" viewBox="0 0 20 14" fill="currentColor">
                    <rect x="0"  y="0"   width="20" height="3" rx="1.5"/>
                    <rect x="6"  y="5.5" width="14" height="3" rx="1.5"/>
                    <rect x="12" y="11"  width="8"  height="3" rx="1.5"/>
                  </svg>
                ),
              },
            ]}
          />
        </FormSection>

      </div>

      {/* ══ RIGHT COLUMN ═════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-3">

        {/* Hero Height */}
        <FormSection
          title="Hero Height"
          subtitle="Set the height of the hero section."
          className={`${card} space-y-2`}
        >
          <RadioGroup
            value={heroHeight}
            onChange={setHeroHeight}
            options={[
              { label: "Small (400px)",  value: "small"      },
              { label: "Medium (600px)", value: "medium"     },
              { label: "Large (800px)",  value: "large"      },
              { label: "Full Screen",    value: "fullscreen" },
            ]}
          />
        </FormSection>

        {/* Overlay Settings */}
        <FormSection
          title="Overlay Settings"
          subtitle="Improve text readability."
          className={`${card} space-y-2`}
        >
          <ToggleField
            label="Enable Overlay"
            checked={overlayEnabled}
            onCheckedChange={setOverlayEnabled}
            className="border-0 bg-transparent p-0"
          />
          <FormSection
            title="Overlay Color"
            className="border-0 bg-transparent p-0 shadow-none"
          >
            <ColorPickerInput value={overlayColor} onChange={setOverlayColor} />
          </FormSection>
          <RangeSliderInput
            label="Overlay Opacity"
            value={overlayOpacity}
            onChange={setOverlayOpacity}
          />
        </FormSection>

        {/* Mobile Settings */}
        <FormSection
          title="Mobile Settings"
          subtitle="Customize for mobile devices."
          className={`${card} space-y-2`}
        >
          <ToggleField
            label="Hide Button 2 on Mobile"
            checked={hideBtn2Mobile}
            onCheckedChange={setHideBtn2Mobile}
            className="border-0 bg-transparent p-0"
          />
          <ToggleField
            label="Center Content on Mobile"
            checked={centerMobile}
            onCheckedChange={setCenterMobile}
            className="border-0 bg-transparent p-0"
          />
          <FormSection
            title="Mobile Hero Height"
            className="border-0 bg-transparent p-0 shadow-none space-y-0.5"
          >
            <Select value={mobileHeroHeight} onValueChange={setMobileHeroHeight}>
              <SelectTrigger className="h-8 px-2 text-[11px] font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small-300">Small (300px)</SelectItem>
                <SelectItem value="medium-500">Medium (500px)</SelectItem>
                <SelectItem value="large-700">Large (700px)</SelectItem>
                <SelectItem value="fullscreen">Full Screen</SelectItem>
              </SelectContent>
            </Select>
          </FormSection>
        </FormSection>

        {/* Need Help? */}
        <FormSection
          title="Need Help?"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[hsl(228_64%_97%)] p-3 shadow-sm space-y-1.5"
        >
          <p className="text-[11px] font-medium text-[var(--vendor-text-muted)] leading-relaxed">
            Learn how to create an engaging hero section.
          </p>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--vendor-primary-btn)] hover:underline"
          >
            <PlayCircle className="h-3.5 w-3.5" />
            Watch Tutorial
          </button>
        </FormSection>

      </div>
    </div>
  );

  // ---------------------------------------------------------------------------
  // Live preview — a simple mock of what the hero looks like on the website.
  // Replace the inner markup with your real preview iframe / component later.
  // ---------------------------------------------------------------------------
  const previewContent = (
    <div className="h-full w-full overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)]">
      {/* Simulated top bar */}
      <div className="flex items-center justify-between bg-[#0B0D17] px-4 py-2 text-[10px] text-white/70">
        <div className="flex items-center gap-3">
          <span>📞 +91 98765 43210</span>
          <span>|</span>
          <span>✉ hello@eventify.com</span>
        </div>
        <div className="flex items-center gap-2">
          <span>f</span><span>in</span><span>▶</span>
        </div>
      </div>

      {/* Simulated nav */}
      <div className="flex items-center justify-between bg-white px-4 py-2 shadow-sm">
        <span className="text-[12px] font-black text-[#6C47FF]">⬛ Eventify</span>
        <div className="hidden items-center gap-3 sm:flex text-[10px] text-gray-700 font-medium">
          <span>Home</span><span>About Us</span><span>Services ▾</span>
          <span>Events</span><span>Gallery</span><span>Contact Us</span>
        </div>
        <div className="rounded-md bg-[#6C47FF] px-3 py-1 text-[10px] font-bold text-white">
          Book Now
        </div>
      </div>

      {/* Hero */}
      <div
        className="relative flex flex-col justify-end overflow-hidden"
        style={{
          minHeight:
            heroHeight === "small" ? 240
            : heroHeight === "large" ? 480
            : heroHeight === "fullscreen" ? 560
            : 360,
          background: "linear-gradient(135deg,#1a1033 0%,#2d1b4e 50%,#3d1a2e 100%)",
        }}
      >
        {/* Overlay */}
        {overlayEnabled && (
          <div
            className="absolute inset-0"
            style={{
              background: overlayColor,
              opacity: overlayOpacity / 100,
            }}
          />
        )}

        {/* Content */}
        <div
          className="relative z-10 flex flex-col gap-3 p-6"
          style={{ alignItems: contentAlign === "center" ? "center" : contentAlign === "right" ? "flex-end" : "flex-start", textAlign: contentAlign }}
        >
          {badgeText && (
            <span className="inline-block rounded-full bg-[#6C47FF]/80 px-3 py-0.5 text-[10px] font-semibold text-white">
              {badgeText}
            </span>
          )}
          <h2
            className="text-white font-black leading-tight"
            style={{ fontSize: previewDevice === "mobile" ? "22px" : "32px" }}
          >
            {title}
          </h2>
          <p className="text-[11px] text-white/80 max-w-md leading-relaxed">
            {description}
          </p>

          {/* Buttons */}
          <div
            className="flex flex-wrap gap-2 mt-1"
            style={{
              justifyContent:
                buttonLayout === "center" ? "center"
                : buttonLayout === "right" ? "flex-end"
                : buttonLayout === "space-between" ? "space-between"
                : "flex-start",
              flexDirection: buttonLayout === "stack" ? "column" : "row",
              alignItems: buttonLayout === "stack" ? (contentAlign === "center" ? "center" : contentAlign === "right" ? "flex-end" : "flex-start") : undefined,
            }}
          >
            {btn1.enabled && (
              <button
                type="button"
                className="rounded-md px-4 py-1.5 text-[11px] font-bold transition"
                style={
                  btn1.style === "Outline"
                    ? { border: `1.5px solid ${btn1.color}`, color: btn1.color, background: "transparent" }
                    : btn1.style === "Ghost"
                    ? { color: btn1.color, background: "transparent" }
                    : { background: btn1.color, color: "#fff" }
                }
              >
                {btn1.label}
              </button>
            )}
            {btn2.enabled && !(previewDevice === "mobile" && hideBtn2Mobile) && (
              <button
                type="button"
                className="rounded-md px-4 py-1.5 text-[11px] font-bold transition"
                style={
                  btn2.style === "Outline"
                    ? { border: `1.5px solid ${btn2.color}`, color: btn2.color, background: "transparent" }
                    : btn2.style === "Ghost"
                    ? { color: btn2.color, background: "transparent" }
                    : { background: btn2.color, color: "#fff" }
                }
              >
                {btn2.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Hero Section"
      form={form}
      preview={previewContent}
      previewDevice={previewDevice}
      previewHeaderAction={
        <DesktopMobileToggle
          value={previewDevice}
          onChange={setPreviewDevice}
        />
      }
      onCancel={handleCancel}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
      primaryButton={{
        label: "Save Changes",
        onClick: handleSave,
        isLoading: isSaving,
      }}
    />
  );
}