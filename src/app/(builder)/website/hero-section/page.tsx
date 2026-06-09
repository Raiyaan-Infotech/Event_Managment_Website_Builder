"use client";

import * as React from "react";
import { Facebook, Instagram, Mail, Phone, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { ImageUpload } from "../_components/image-upload";
import { ColorPickerInput } from "../_components/color-picker-input";
import { RangeSliderInput } from "../_components/range-slider-input";
import { ToggleField } from "../_components/toggle-field";
import { DesktopMobileToggle, type PreviewDevice } from "../_components/desktop-mobile-toggle";
import { BuilderCountedInput, BuilderCountedTextarea, BuilderIconOptionGroup } from "../_components/builder-field";
import { RadioGroup } from "../_components/radio-group";

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

interface SocialLink {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
}

const socialLinks: SocialLink[] = [
  { id: "instagram", icon: Instagram },
  { id: "facebook", icon: Facebook },
  { id: "youtube", icon: Youtube },
];

function ButtonFields({
  btn,
  setBtn,
}: {
  btn: CTAButton;
  setBtn: React.Dispatch<React.SetStateAction<CTAButton>>;
}) {
  return (
    <div className="grid grid-cols-[1fr_1fr_74px_38px] items-start gap-1.5">
      <BuilderCountedInput label="Label" value={btn.label} onChange={(label) => setBtn((prev) => ({ ...prev, label }))} maxLength={30} />
      <BuilderCountedInput label="Link" value={btn.link} onChange={(link) => setBtn((prev) => ({ ...prev, link }))} maxLength={100} />
      <div className="space-y-1">
        <p className="text-[10px] font-semibold text-slate-600">Style</p>
        <Select value={btn.style} onValueChange={(style) => setBtn((prev) => ({ ...prev, style: style as ButtonStyle }))}>
          <SelectTrigger className="h-9 px-2 text-[10px] font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Primary">Primary</SelectItem>
            <SelectItem value="Outline">Outline</SelectItem>
            <SelectItem value="Ghost">Ghost</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-semibold text-slate-600">Color</p>
        <ColorPickerInput value={btn.color} onChange={(color) => setBtn((prev) => ({ ...prev, color }))} />
      </div>
    </div>
  );
}

function HeroPreview({
  device,
  companyName,
  mobile,
  email,
  badgeText,
  title,
  description,
  btn1,
  btn2,
  buttonLayout,
  contentAlign,
  overlayColor,
  overlayOpacity,
}: {
  device: PreviewDevice;
  companyName: string;
  mobile: string;
  email: string;
  badgeText: string;
  title: string;
  description: string;
  btn1: CTAButton;
  btn2: CTAButton;
  buttonLayout: ButtonLayout;
  contentAlign: ContentAlign;
  overlayColor: string;
  overlayOpacity: number;
}) {
  const isMobile = device === "mobile";
  const navItems = ["Home", "About Us", "Services", "Events", "Gallery", "Contact Us"];
  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center mx-auto",
    right: "items-end text-right ml-auto",
  }[contentAlign];
  const buttonClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    "space-between": "justify-between",
    stack: "flex-col items-start",
  }[buttonLayout];

  return (
    <div className="min-h-0 flex-1 overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white shadow-sm">
      <div className={isMobile ? "mx-auto flex h-full max-w-[320px] flex-col border-x border-[var(--vendor-border)]" : "flex h-full flex-col"}>
        {!isMobile ? (
          <div className="flex h-8 shrink-0 items-center justify-between bg-[#101010] px-5 text-[10px] font-semibold text-white">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5"><Phone className="h-3 w-3" />{mobile}</span>
              <span className="h-3 w-px bg-white/30" />
              <span className="inline-flex items-center gap-1.5"><Mail className="h-3 w-3" />{email}</span>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ id, icon: Icon }) => <Icon key={id} className="h-3.5 w-3.5" />)}
            </div>
          </div>
        ) : null}

        <div className="flex h-12 shrink-0 items-center justify-between bg-white px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)] text-white">
              <span className="text-[12px] font-black">{companyName.slice(0, 2).toUpperCase()}</span>
            </div>
            <p className="max-w-44 truncate text-[14px] font-black text-slate-950">{companyName}</p>
          </div>
          {isMobile ? (
            <button className="flex h-8 w-8 items-center justify-center rounded-[var(--vendor-radius-control)] border border-slate-200 text-slate-950">=</button>
          ) : (
            <div className="flex min-w-0 items-center gap-4 text-[11px] font-bold text-slate-950">
              {navItems.map((item, index) => (
                <span key={item} className={index === 0 ? "text-[var(--vendor-primary-btn)]" : ""}>{item}</span>
              ))}
              <Button className="h-8 px-4 text-[11px]">Book Now</Button>
            </div>
          )}
        </div>

        <div
          className="relative flex min-h-0 flex-1 overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(110deg, rgba(2,6,23,.92), rgba(2,6,23,.58) 42%, rgba(2,6,23,.16)), url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80')",
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity / 100 }} />
          <div className={`relative z-10 flex w-full px-6 py-8 text-white ${contentAlign === "center" ? "justify-center" : contentAlign === "right" ? "justify-end" : "justify-start"}`}>
            <div className={`flex max-w-[470px] flex-col ${alignClass}`}>
              {badgeText ? (
                <span className="mb-4 inline-flex rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)]/25 px-3 py-1 text-[11px] font-bold text-violet-200">
                  {badgeText}
                </span>
              ) : null}
              <h3 className="text-[34px] font-black leading-[1.08] tracking-tight">{title}</h3>
              <p className="mt-4 text-[14px] font-medium leading-6 text-white/90">{description}</p>
              <div className={`mt-5 flex w-full gap-3 ${buttonClass}`}>
                {btn1.enabled ? (
                  <Button className="h-9 px-4 text-[12px]" style={{ backgroundColor: btn1.color }}>
                    {btn1.label}
                  </Button>
                ) : null}
                {btn2.enabled ? (
                  <Button variant="outline" className="h-9 border-white/60 bg-transparent px-4 text-[12px] text-white hover:bg-white/10">
                    {btn2.label}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSectionPage() {
  const [device, setDevice] = React.useState<PreviewDevice>("desktop");
  const [companyName] = React.useState("Eventify");
  const [mobile] = React.useState("+91 98765 43210");
  const [email] = React.useState("hello@eventify.com");
  const [badgeText, setBadgeText] = React.useState("Best Event Management");
  const [title, setTitle] = React.useState("We Create Unforgettable Moments");
  const [description, setDescription] = React.useState("From elegant weddings to corporate events, we handle every detail with creativity and perfection. Let us bring your dream event to life.");
  const [btn1, setBtn1] = React.useState<CTAButton>({ enabled: true, label: "Explore Events", link: "/events", style: "Primary", color: "#6C47FF" });
  const [btn2, setBtn2] = React.useState<CTAButton>({ enabled: true, label: "Contact Us", link: "/contact", style: "Outline", color: "#FFFFFF" });
  const [buttonLayout, setButtonLayout] = React.useState<ButtonLayout>("left");
  const [contentAlign, setContentAlign] = React.useState<ContentAlign>("left");
  const [heroHeight, setHeroHeight] = React.useState("medium");
  const [overlayEnabled, setOverlayEnabled] = React.useState(true);
  const [overlayColor, setOverlayColor] = React.useState("#0B0D17");
  const [overlayOpacity, setOverlayOpacity] = React.useState(60);
  const [hideBtn2Mobile, setHideBtn2Mobile] = React.useState(false);
  const [centerMobile, setCenterMobile] = React.useState(true);
  const [mobileHeroHeight, setMobileHeroHeight] = React.useState("medium-500");

  const form = (
    <div className="space-y-2">
      <FormSection title="Hero Content" className="border-b border-[var(--vendor-border)] pb-2.5">
        <ImageUpload label="Hero Image" hint="Recommended: 1920x1080px or higher. Max 2MB." />
        <BuilderCountedInput label="Badge Text (Optional)" value={badgeText} onChange={setBadgeText} maxLength={50} />
        <BuilderCountedInput label="Title" required value={title} onChange={setTitle} maxLength={70} />
        <BuilderCountedTextarea label="Description" value={description} onChange={setDescription} maxLength={300} textareaClassName="min-h-[52px]" />
      </FormSection>

      <FormSection title="Button 1 (Primary CTA)" actions={<Switch checked={btn1.enabled} onCheckedChange={(enabled) => setBtn1((prev) => ({ ...prev, enabled }))} />} className="border-b border-[var(--vendor-border)] pb-2.5">
        <ButtonFields btn={btn1} setBtn={setBtn1} />
      </FormSection>

      <FormSection title="Button 2 (Optional CTA)" actions={<Switch checked={btn2.enabled} onCheckedChange={(enabled) => setBtn2((prev) => ({ ...prev, enabled }))} />} className="border-b border-[var(--vendor-border)] pb-2.5">
        <ButtonFields btn={btn2} setBtn={setBtn2} />
      </FormSection>

      <FormSection title="Button Layout" className="border-b border-[var(--vendor-border)] pb-2.5">
        <BuilderIconOptionGroup
          value={buttonLayout}
          onChange={setButtonLayout}
          columns="5"
          options={[
            { value: "left", label: "Left", icon: <span className="h-3 w-5 rounded-sm bg-current" /> },
            { value: "center", label: "Center", icon: <span className="h-3 w-5 rounded-sm bg-current" /> },
            { value: "right", label: "Right", icon: <span className="h-3 w-5 rounded-sm bg-current" /> },
            { value: "space-between", label: "Space", icon: <span className="h-3 w-5 rounded-sm bg-current" /> },
            { value: "stack", label: "Stack", icon: <span className="h-3 w-5 rounded-sm bg-current" /> },
          ]}
        />
      </FormSection>

      <FormSection title="Content Alignment">
        <BuilderIconOptionGroup
          value={contentAlign}
          onChange={setContentAlign}
          columns="3"
          options={[
            { value: "left", label: "Left", icon: <span className="h-3 w-5 rounded-sm bg-current" /> },
            { value: "center", label: "Center", icon: <span className="h-3 w-5 rounded-sm bg-current" /> },
            { value: "right", label: "Right", icon: <span className="h-3 w-5 rounded-sm bg-current" /> },
          ]}
        />
      </FormSection>
    </div>
  );

  const sidebar = (
    <div className="space-y-2">
      <FormSection title="Hero Height" className="border-b border-[var(--vendor-border)] pb-2.5">
        <RadioGroup value={heroHeight} onChange={setHeroHeight} options={[
          { label: "Small (400px)", value: "small" },
          { label: "Medium (600px)", value: "medium" },
          { label: "Large (800px)", value: "large" },
          { label: "Full Screen", value: "fullscreen" },
        ]} />
      </FormSection>

      <FormSection title="Overlay Settings" className="border-b border-[var(--vendor-border)] pb-2.5">
        <ToggleField label="Enable Overlay" checked={overlayEnabled} onCheckedChange={setOverlayEnabled} className="border-0 bg-transparent p-0" />
        <div className="mt-2">
          <p className="mb-1 text-[10px] font-semibold text-slate-600">Overlay Color</p>
          <ColorPickerInput value={overlayColor} onChange={setOverlayColor} />
        </div>
        <RangeSliderInput label="Overlay Opacity" value={overlayOpacity} onChange={setOverlayOpacity} className="mt-2" />
      </FormSection>

      <FormSection title="Mobile Settings" className="border-b border-[var(--vendor-border)] pb-2.5">
        <ToggleField label="Hide Button 2 on Mobile" checked={hideBtn2Mobile} onCheckedChange={setHideBtn2Mobile} className="border-0 bg-transparent p-0" />
        <ToggleField label="Center Content on Mobile" checked={centerMobile} onCheckedChange={setCenterMobile} className="mt-2 border-0 bg-transparent p-0" />
        <div className="mt-2">
          <p className="mb-1 text-[10px] font-semibold text-slate-600">Mobile Hero Height</p>
          <Select value={mobileHeroHeight} onValueChange={setMobileHeroHeight}>
            <SelectTrigger className="h-9 px-2 text-[10px] font-semibold">
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

      <div className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-primary-btn)]/20 bg-[var(--vendor-primary-btn)]/5 p-2.5">
        <p className="text-[11px] font-bold text-slate-800">Need Help?</p>
        <p className="mt-0.5 text-[10px] font-medium leading-4 text-slate-500">Learn how to create an engaging hero section.</p>
        <button type="button" className="mt-2 text-[10px] font-bold text-[var(--vendor-primary-btn)]">Watch Tutorial</button>
      </div>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Hero Section"
      form={form}
      sidebar={sidebar}
      preview={
        <HeroPreview
          device={device}
          companyName={companyName}
          mobile={mobile}
          email={email}
          badgeText={badgeText}
          title={title}
          description={description}
          btn1={btn1}
          btn2={btn2}
          buttonLayout={buttonLayout}
          contentAlign={contentAlign}
          overlayColor={overlayEnabled ? overlayColor : "transparent"}
          overlayOpacity={overlayEnabled ? overlayOpacity : 0}
        />
      }
      previewTitle="Live Preview"
      previewSubtitle="This is how your hero section will appear on your website."
      previewActions={<DesktopMobileToggle value={device} onChange={setDevice} />}
      contentClassName="xl:grid-cols-[minmax(300px,350px)_minmax(170px,210px)_minmax(0,1fr)]"
    />
  );
}
