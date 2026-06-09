"use client";
import * as React from "react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { Button } from "@/components/ui/button";
import { FormSection } from "../_components/form-section";
import { ImageUpload } from "../_components/image-upload";
import { ColorPickerInput } from "../_components/color-picker-input";
import { RangeSliderInput } from "../_components/range-slider-input";
import { ToggleField } from "../_components/toggle-field";
import {
  DesktopMobileToggle,
  type PreviewDevice,
} from "../_components/desktop-mobile-toggle";
import {
  BuilderIconOptionGroup,
  BuilderCountedInput,
  BuilderCountedTextarea,
} from "../_components/builder-field";
import { Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup } from "../_components/radio-group";
import { FormActions } from "../_components/form-actions";

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface SocialLink {
  id: string;
  label: string;
  url: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const initialSocialLinks: SocialLink[] = [
  { id: "whatsapp",  label: "WhatsApp",  url: "https://wa.me/919876543210",          color: "#25D366", icon: Phone },
  { id: "instagram", label: "Instagram", url: "https://instagram.com/royalmoments",  color: "#E4405F", icon: Instagram },
  { id: "facebook",  label: "Facebook",  url: "https://facebook.com/royalmoments",   color: "#1877F2", icon: Facebook },
  { id: "youtube",   label: "YouTube",   url: "https://youtube.com/@royalmoments",   color: "#FF0000", icon: Youtube },
];

// ─── HeaderPreview ────────────────────────────────────────────────────────────

function HeaderPreview({
  device, companyName, city, mobile, email, address, socialLinks,
}: {
  device: PreviewDevice;
  companyName: string;
  city: string;
  mobile: string;
  email: string;
  address: string;
  socialLinks: SocialLink[];
}) {
  const navItems = ["Home", "About Us", "Services", "Events", "Gallery", "Contact Us"];
  const isMobile = device === "mobile";

  return (
    <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white shadow-sm">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-[var(--vendor-border)] bg-slate-50 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <div className="ml-3 flex-1 truncate rounded bg-white px-3 py-1 text-[11px] font-semibold text-slate-500">
          {companyName.toLowerCase().replace(/\s+/g, "")}.yourdomain.com
        </div>
      </div>

      {/*
        Preview scale:
        - below xl → preview is full-width, use progressively bigger scale
        - xl+      → preview is right column (~narrow), reset to small scale
        overflow-hidden on the wrapper catches any clipping edge-cases.
      */}
      <div className="overflow-hidden">
        <div
          className={
            isMobile
              ? "mx-auto max-w-[390px] border-x border-[var(--vendor-border)]"
              : [
                  "origin-top-left",
                  // single-column layout (full width preview panel)
                  "scale-[0.52] w-[192%]",
                  "sm:scale-[0.60] sm:w-[167%]",
                  "md:scale-[0.68] md:w-[147%]",
                  "lg:scale-[0.76] lg:w-[132%]",
                  // xl: 2-col layout — preview is right col (~2.5fr of ~1100px ≈ 470px)
                  "xl:scale-[0.56] xl:w-[179%]",
                  // 2xl: 3-col layout — preview is narrower right col (~2.5fr of ~1300px ≈ 430px)
                  "2xl:scale-[0.52] 2xl:w-[192%]",
                ].join(" ")
          }
        >
          {!isMobile ? (
            <div className="flex items-center justify-between bg-[#101010] px-8 py-3 text-xs font-semibold text-white">
              <div className="flex items-center gap-5">
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />{mobile}
                </span>
                <span className="h-4 w-px bg-white/30" />
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />{email}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {socialLinks.slice(1).map((item) => {
                  const Icon = item.icon;
                  return <Icon key={item.id} className="h-4 w-4" />;
                })}
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between bg-white px-8 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[var(--vendor-radius-control)] border border-[var(--vendor-primary-btn)]/20 bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
                <span className="text-lg font-black">{companyName.slice(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <p className="max-w-40 truncate text-base font-black tracking-tight text-slate-950">{companyName}</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">Events</p>
              </div>
            </div>

            {isMobile ? (
              <button className="flex h-10 w-10 items-center justify-center rounded-[var(--vendor-radius-control)] border border-slate-200 text-slate-950">
                <span className="text-xl leading-none">☰</span>
              </button>
            ) : (
              <div className="flex min-w-0 items-center gap-5 text-sm font-bold text-slate-950">
                {navItems.map((item, index) => (
                  <span key={item} className={`whitespace-nowrap ${index === 0 ? "text-[var(--vendor-primary-btn)]" : ""}`}>
                    {item}
                  </span>
                ))}
                <Button className="h-11 px-5">Book Now</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HeroSectionPage() {
  const [device, setDevice]           = React.useState<PreviewDevice>("desktop");
  const [companyName, setCompanyName] = React.useState("Royal Moments Events");
  const [city, setCity]               = React.useState("New Delhi, India");
  const [mobile, setMobile]           = React.useState("+91 98765 43210");
  const [email, setEmail]             = React.useState("info@royalmoments.com");
  const [address, setAddress]         = React.useState("123, Wedding Avenue, Connaught Place, New Delhi - 110001");

  const [badgeText, setBadgeText]     = React.useState("Best Event Management");
  const [title, setTitle]             = React.useState("We Create Unforgettable Moments");
  const [description, setDescription] = React.useState(
    "From elegant weddings to corporate events, we handle every detail with creativity and perfection. Let us bring your dream event to life.",
  );

  const [btn1, setBtn1] = React.useState<CTAButton>({ enabled: true, label: "Explore Events", link: "/events",  style: "Primary", color: "#6C47FF" });
  const [btn2, setBtn2] = React.useState<CTAButton>({ enabled: true, label: "Contact Us",     link: "/contact", style: "Outline", color: "#FFFFFF" });

  const [buttonLayout, setButtonLayout]   = React.useState<ButtonLayout>("left");
  const [contentAlign, setContentAlign]   = React.useState<ContentAlign>("left");
  const [heroHeight, setHeroHeight]       = React.useState("medium");
  const [overlayEnabled, setOverlayEnabled] = React.useState(true);
  const [overlayColor, setOverlayColor]   = React.useState("#080D17");
  const [overlayOpacity, setOverlayOpacity] = React.useState(60);
  const [hideBtn2Mobile, setHideBtn2Mobile] = React.useState(false);
  const [centerMobile, setCenterMobile]   = React.useState(true);
  const [mobileHeroHeight, setMobileHeroHeight] = React.useState("medium-500");
  const [socialLinks]                     = React.useState<SocialLink[]>(initialSocialLinks);

  // ── Button row helper — reused for btn1 and btn2 ────────────────────────────
  // FIX: was md:grid-cols-[160px_160px_140px_140px] = 600px minimum → horizontal scroll.
  // Now: fluid 2-col on mobile (label+link), style+color below; at lg all 4 in one row.
  function ButtonFields({
    btn, setBtn,
  }: {
    btn: CTAButton;
    setBtn: React.Dispatch<React.SetStateAction<CTAButton>>;
  }) {
    return (
      <div className="grid items-start gap-3 grid-cols-2 sm:grid-cols-[2fr_2fr_1fr_auto] lg:grid-cols-[2fr_2fr_1fr_auto]">
        <BuilderCountedInput
          label="Label"
          value={btn.label}
          onChange={(v) => setBtn((p) => ({ ...p, label: v }))}
          maxLength={30}
        />
        <BuilderCountedInput
          label="Link"
          value={btn.link}
          onChange={(v) => setBtn((p) => ({ ...p, link: v }))}
          maxLength={100}
        />
        <div>
          <p className="mb-1.5 text-[12px] font-semibold text-slate-700">Style</p>
          <Select
            value={btn.style}
            onValueChange={(v) => setBtn((p) => ({ ...p, style: v as ButtonStyle }))}
          >
            <SelectTrigger className="h-9 text-[13px] font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Primary">Primary</SelectItem>
              <SelectItem value="Outline">Outline</SelectItem>
              <SelectItem value="Ghost">Ghost</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <p className="mb-1.5 text-[12px] font-semibold text-slate-700">Color</p>
          <ColorPickerInput
            value={btn.color}
            onChange={(color) => setBtn((p) => ({ ...p, color }))}
          />
        </div>
      </div>
    );
  }

  // ── Form (left panel) ────────────────────────────────────────────────────────
  const form = (
    <div className="space-y-4">

      {/* Hero Content */}
      <FormSection title="Hero Content" className="pb-4 border-b border-[var(--vendor-border)]">
        <ImageUpload
          label="Hero Image"
          hint="Recommended: 1920x1080px or higher. Max 2MB."
        />
        <BuilderCountedInput label="Badge Text (Optional)" value={badgeText} onChange={setBadgeText} maxLength={50} />
        <BuilderCountedInput label="Title" required value={title} onChange={setTitle} maxLength={70} />
        <BuilderCountedTextarea
          label="Description"
          value={description}
          onChange={setDescription}
          maxLength={300}
          textareaClassName="min-h-[100px]"
        />
      </FormSection>

      {/* Button 1 */}
      <FormSection
        title="Button 1 (Primary CTA)"
        actions={<Switch checked={btn1.enabled} onCheckedChange={(enabled) => setBtn1((p) => ({ ...p, enabled }))} />}
        className="pb-4 border-b border-[var(--vendor-border)]"
      >
        <ButtonFields btn={btn1} setBtn={setBtn1} />
      </FormSection>

      {/* Button 2 */}
      <FormSection
        title="Button 2 (Optional CTA)"
        actions={<Switch checked={btn2.enabled} onCheckedChange={(enabled) => setBtn2((p) => ({ ...p, enabled }))} />}
        className="pb-4 border-b border-[var(--vendor-border)]"
      >
        <ButtonFields btn={btn2} setBtn={setBtn2} />
      </FormSection>

      {/* Button Layout
          FIX: BuilderIconOptionGroup was using default "auto" columns with minmax(64px,1fr).
          5 options × 64px = 320px minimum — fine on its own, but the last 2 items were
          wrapping onto a second row because the auto-fill logic left orphan cells.
          Fix: pass columns="auto" (already the default) but ensure the group
          uses the responsive grid from builder-field.tsx.
          For 5 items we want exactly 5 cols at sm+, 3+2 below that — pass columns="auto"
          and let auto-fill handle it (min 72px per cell gives 5 cells at ~400px+).
      */}
      <FormSection title="Button Layout" className="pb-4 border-b border-[var(--vendor-border)]">
        <BuilderIconOptionGroup
          value={buttonLayout}
          onChange={setButtonLayout}
          columns="5"
          options={
            [
              {
                value: "left",
                label: "Left",
                icon: (
                  <svg viewBox="0 0 22 16" className="h-5 w-5" fill="none">
                    <rect x="1" y="2" width="9" height="5" rx="1.5" fill="currentColor" opacity=".85" />
                    <rect x="1" y="9" width="9" height="5" rx="1.5" fill="currentColor" opacity=".4" />
                  </svg>
                ),
              },
              {
                value: "center",
                label: "Center",
                icon: (
                  <svg viewBox="0 0 22 16" className="h-5 w-5" fill="none">
                    <rect x="6.5" y="2" width="9" height="5" rx="1.5" fill="currentColor" opacity=".85" />
                    <rect x="6.5" y="9" width="9" height="5" rx="1.5" fill="currentColor" opacity=".4" />
                  </svg>
                ),
              },
              {
                value: "right",
                label: "Right",
                icon: (
                  <svg viewBox="0 0 22 16" className="h-5 w-5" fill="none">
                    <rect x="12" y="2" width="9" height="5" rx="1.5" fill="currentColor" opacity=".85" />
                    <rect x="12" y="9" width="9" height="5" rx="1.5" fill="currentColor" opacity=".4" />
                  </svg>
                ),
              },
              {
                value: "space-between",
                label: "Space Between",
                icon: (
                  <svg viewBox="0 0 22 16" className="h-5 w-5" fill="none">
                    <rect x="1"  y="5.5" width="7" height="5" rx="1.5" fill="currentColor" opacity=".85" />
                    <rect x="14" y="5.5" width="7" height="5" rx="1.5" fill="currentColor" opacity=".4" />
                  </svg>
                ),
              },
              {
                value: "stack",
                label: "Stack Vertical",
                icon: (
                  <svg viewBox="0 0 22 16" className="h-5 w-5" fill="none">
                    <rect x="3" y="1"  width="16" height="5" rx="1.5" fill="currentColor" opacity=".85" />
                    <rect x="3" y="10" width="16" height="5" rx="1.5" fill="currentColor" opacity=".4" />
                  </svg>
                ),
              },
            ] as { value: ButtonLayout; label: string; icon: React.ReactNode }[]
          }
        />
      </FormSection>

      {/* Content Alignment */}
      <FormSection title="Content Alignment" className="pb-4 border-b border-[var(--vendor-border)]">
        <BuilderIconOptionGroup
          value={contentAlign}
          onChange={setContentAlign}
          columns="3"
          optionClassName="px-5"
          options={
            [
              {
                value: "left",
                label: "Left",
                icon: (
                  <svg viewBox="0 0 22 16" className="h-5 w-5" fill="none">
                    <rect x="1" y="2"  width="14" height="2.5" rx="1" fill="currentColor" opacity=".85" />
                    <rect x="1" y="6.5" width="10" height="2.5" rx="1" fill="currentColor" opacity=".55" />
                    <rect x="1" y="11" width="12" height="2.5" rx="1" fill="currentColor" opacity=".4" />
                  </svg>
                ),
              },
              {
                value: "center",
                label: "Center",
                icon: (
                  <svg viewBox="0 0 22 16" className="h-5 w-5" fill="none">
                    <rect x="4" y="2"  width="14" height="2.5" rx="1" fill="currentColor" opacity=".85" />
                    <rect x="6" y="6.5" width="10" height="2.5" rx="1" fill="currentColor" opacity=".55" />
                    <rect x="5" y="11" width="12" height="2.5" rx="1" fill="currentColor" opacity=".4" />
                  </svg>
                ),
              },
              {
                value: "right",
                label: "Right",
                icon: (
                  <svg viewBox="0 0 22 16" className="h-5 w-5" fill="none">
                    <rect x="7"  y="2"  width="14" height="2.5" rx="1" fill="currentColor" opacity=".85" />
                    <rect x="11" y="6.5" width="10" height="2.5" rx="1" fill="currentColor" opacity=".4" />
                    <rect x="9"  y="11" width="12" height="2.5" rx="1" fill="currentColor" opacity=".4" />
                  </svg>
                ),
              },
            ] as { value: ContentAlign; label: string; icon: React.ReactNode }[]
          }
        />
      </FormSection>

      <FormActions layout="end" className="pt-2" />
    </div>
  );

  // ── Sidebar (right settings panel) ───────────────────────────────────────────
  const sidebar = (
    <div className="space-y-4">

      {/* Hero Height */}
      <FormSection
        title="Hero Height"
        className="border-0 bg-transparent p-0 shadow-none pb-4 border-b border-[var(--vendor-border)]"
      >
        <RadioGroup
          value={heroHeight}
          onChange={setHeroHeight}
          options={[
            { label: "Small (400px)",  value: "small" },
            { label: "Medium (600px)", value: "medium" },
            { label: "Large (800px)",  value: "large" },
            { label: "Full Screen",    value: "fullscreen" },
          ]}
        />
      </FormSection>

      {/* Overlay Settings */}
      <FormSection
        title="Overlay Settings"
        className="border-0 bg-transparent p-0 shadow-none pb-4 border-b border-[var(--vendor-border)]"
      >
        <ToggleField
          label="Enable Overlay"
          checked={overlayEnabled}
          onCheckedChange={setOverlayEnabled}
          className="border-0 bg-transparent p-0"
        />
        <div className="mt-3">
          <p className="mb-1.5 text-[12px] font-semibold text-slate-700">Overlay Color</p>
          <ColorPickerInput value={overlayColor} onChange={setOverlayColor} />
        </div>
        <RangeSliderInput label="Overlay Opacity" value={overlayOpacity} onChange={setOverlayOpacity} className="mt-3" />
      </FormSection>

      {/* Mobile Settings */}
      <FormSection
        title="Mobile Settings"
        className="border-0 bg-transparent p-0 shadow-none pb-4 border-b border-[var(--vendor-border)]"
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
          className="mt-3 border-0 bg-transparent p-0"
        />
        <div className="mt-3">
          <p className="mb-1.5 text-[12px] font-semibold text-slate-700">Mobile Hero Height</p>
          <Select value={mobileHeroHeight} onValueChange={setMobileHeroHeight}>
            <SelectTrigger className="h-9 text-[13px] font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small-300">Small (300px)</SelectItem>
              <SelectItem value="medium-500">Medium (500px)</SelectItem>
              <SelectItem value="large-700">Large (700px)</SelectItem>
              <SelectItem value="fullscreen">Full Screen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FormSection>

      {/* Need Help */}
      <div className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-primary-btn)]/20 bg-[var(--vendor-primary-btn)]/5 p-4">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 text-[var(--vendor-primary-btn)]">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </span>
          <div>
            <p className="text-[13px] font-bold text-slate-800">Need Help?</p>
            <p className="mt-0.5 text-[12px] text-slate-500">Learn how to create an engaging hero section.</p>
          </div>
        </div>
        <button
          type="button"
          className="mt-3 flex items-center gap-1.5 text-[12px] font-bold text-[var(--vendor-primary-btn)]"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Watch Tutorial
        </button>
      </div>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Hero Section"
      form={form}
      sidebar={sidebar}
      preview={
        <HeaderPreview
          device={device}
          companyName={companyName}
          city={city}
          mobile={mobile}
          email={email}
          address={address}
          socialLinks={socialLinks}
        />
      }
      previewTitle="Live Website Preview"
      previewSubtitle="This is how your header will appear on your website."
      previewActions={<DesktopMobileToggle value={device} onChange={setDevice} />}
      saveLabel="Save Changes"
      // 3-col layout needs ~1536px+ (2xl) to fit comfortably with sidebar.
      // At xl (1280px): sidebar 230px + 3 columns is too tight → form labels word-wrap.
      // Below 2xl: WebsiteBuilderLayout stacks form+sidebar in left col, preview right.
      contentClassName="2xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)_minmax(0,2.5fr)] xl:grid-cols-[minmax(0,3fr)_minmax(0,2.5fr)]"
    />
  );
}