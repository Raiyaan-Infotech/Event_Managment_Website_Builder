"use client";

import * as React from "react";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { ImageUpload } from "../_components/image-upload";
import { MultiSelectPages } from "../_components/multi-select-pages";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
  BuilderSegmentedControl,
} from "../_components/builder-field";
import { ToggleField } from "../_components/toggle-field";
import {
  DesktopMobileToggle,
  type PreviewDevice,
} from "../_components/desktop-mobile-toggle";

type ContactType = "default" | "alternative";

const pageOptions = [
  { label: "Sample Page",        value: "sample-page" },
  { label: "Terms & Conditions", value: "terms"        },
  { label: "Privacy Policy",     value: "privacy"      },
  { label: "About Us",           value: "about"        },
  { label: "Contact Us",         value: "contact"      },
];

const socialIcons = [
  { label: "Twitter",   icon: Twitter   },
  { label: "Instagram", icon: Instagram },
  { label: "Facebook",  icon: Facebook  },
  { label: "YouTube",   icon: Youtube   },
];

export default function FooterPage() {
  const [companyName, setCompanyName]             = React.useState("Eventify");
  const [shortDescription, setShortDescription]   = React.useState(
    "Creating unforgettable experiences with creativity, precision, and passion. We turn your moments into lasting memories.",
  );
  const [showSocialLinks, setShowSocialLinks]     = React.useState(true);
  const [topListHeading, setTopListHeading]       = React.useState("Quick Links");
  const [selectedPages, setSelectedPages]         = React.useState(["sample-page", "terms", "privacy"]);
  const [newsletterEnabled, setNewsletterEnabled] = React.useState(true);
  const [contactType, setContactType]             = React.useState<ContactType>("default");
  const [mobile, setMobile]                       = React.useState("+1 234 567 8900");
  const [email, setEmail]                         = React.useState("hello@eventify.com");
  const [address, setAddress]                     = React.useState(
    "123 Celebration Street, Event City, New York, NY 10001, USA",
  );
  const [previewDevice, setPreviewDevice]         = React.useState<PreviewDevice>("desktop");
  const [isSaving, setIsSaving]                   = React.useState(false);

  const copyright = "© 2026 EventCraft Pro. All rights reserved.";
  const poweredBy = "Powered by Raiyaan Infotech";

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };
  const handleCancel = () => {
    setCompanyName("Eventify");
    setShortDescription("Creating unforgettable experiences with creativity, precision, and passion. We turn your moments into lasting memories.");
    setShowSocialLinks(true);
    setTopListHeading("Quick Links");
    setSelectedPages(["sample-page", "terms", "privacy"]);
    setNewsletterEnabled(true);
    setContactType("default");
    setMobile("+1 234 567 8900");
    setEmail("hello@eventify.com");
    setAddress("123 Celebration Street, Event City, New York, NY 10001, USA");
    setPreviewDevice("desktop");
  };

  const quickLinkLabels = selectedPages
    .map((v) => pageOptions.find((p) => p.value === v)?.label)
    .filter(Boolean) as string[];

  // ── Form ────────────────────────────────────────────────────────────────────
  const form = (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">

      {/* ── LEFT COLUMN ── */}
      <div className="flex flex-col gap-3">

        {/* Company Information — logo left, fields right */}
        <FormSection
          title="Company Information"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm"
        >
          <div className="flex gap-3">
            {/* Logo upload — fixed width */}
            <div className="shrink-0 w-[130px]">
              <ImageUpload
                label="Company Logo"
                recommendedSize="200x200px"
                maxFileSize="2MB"
              />
            </div>
            {/* Name + Description */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <BuilderCountedInput
                label="Company Name"
                value={companyName}
                onChange={setCompanyName}
                maxLength={100}
                inputClassName="!h-7 text-[10px]"
              />
              <BuilderCountedTextarea
                label="Short Description"
                value={shortDescription}
                onChange={setShortDescription}
                maxLength={200}
                textareaClassName="!min-h-[5.5rem] text-[10px] resize-y"
              />
            </div>
          </div>
        </FormSection>

        {/* Contact Info */}
        <FormSection
          title="Contact Info"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-2"
        >
          <BuilderSegmentedControl<ContactType>
            label="Contact Type"
            value={contactType}
            onChange={setContactType}
            options={[
              { label: "Default",     value: "default"     },
              { label: "Alternative", value: "alternative" },
            ]}
            layout="grid"
          />
          <div className="grid grid-cols-2 gap-2">
            <BuilderCountedInput
              label="Mobile"
              value={mobile}
              onChange={setMobile}
              maxLength={30}
              inputClassName="!h-7 text-[10px]"
            />
            <BuilderCountedInput
              label="Email"
              value={email}
              onChange={setEmail}
              maxLength={100}
              inputClassName="!h-7 text-[10px]"
            />
          </div>
          <BuilderCountedTextarea
            label="Address"
            value={address}
            onChange={setAddress}
            maxLength={200}
            textareaClassName="!min-h-[3rem] !max-h-[3rem] text-[10px]"
          />
        </FormSection>

      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="flex flex-col gap-3">

        {/* Menu / Footer Settings */}
        <FormSection
          title="Menu Settings"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-2"
        >
          <BuilderCountedInput
            label="Top List Heading"
            value={topListHeading}
            onChange={setTopListHeading}
            maxLength={80}
            inputClassName="!h-7 text-[10px]"
          />
          <MultiSelectPages
            label="Add Pages"
            value={selectedPages}
            options={pageOptions}
            onChange={setSelectedPages}
            placeholder="Add page"
          />
          <label className="flex cursor-pointer items-center gap-2 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-slate-50/60 px-2.5 py-2">
            <input
              type="checkbox"
              checked={newsletterEnabled}
              onChange={(e) => setNewsletterEnabled(e.target.checked)}
              className="h-3.5 w-3.5 accent-[var(--vendor-primary-btn)]"
            />
            <div>
              <p className="text-[10px] font-bold text-[var(--vendor-text)]">Enable Newsletter</p>
              <p className="text-[9px] font-medium text-[var(--vendor-text-muted)]">
                Allow visitors to subscribe to your newsletter.
              </p>
            </div>
          </label>
          <ToggleField
            label="Show Social Links"
            description="Display social media links in footer."
            checked={showSocialLinks}
            onCheckedChange={setShowSocialLinks}
            className="border border-[var(--vendor-border)] bg-slate-50/60 px-2.5 py-2 rounded-[var(--vendor-radius-control)]"
          />
        </FormSection>

        {/* Footer Bottom */}
        <FormSection
          title="Footer Bottom"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-2"
        >
          <div className="grid grid-cols-2 gap-2">
            <BuilderCountedInput
              label="Copyright"
              value={copyright}
              onChange={() => undefined}
              maxLength={120}
              lockInput
              showCount={false}
              labelClassName="text-[9px] font-black uppercase tracking-wide text-slate-500"
              inputClassName="!h-7 text-[10px]"
            />
            <BuilderCountedInput
              label="Powered By"
              value={poweredBy}
              onChange={() => undefined}
              maxLength={80}
              lockInput
              showCount={false}
              labelClassName="text-[9px] font-black uppercase tracking-wide text-slate-500"
              inputClassName="!h-7 text-[10px]"
            />
          </div>
        </FormSection>

      </div>
    </div>
  );

  // ── Live Preview — footer only ───────────────────────────────────────────────
  const isMobile = previewDevice === "mobile";

  const previewContent = (
    <div className="h-full w-full overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] flex flex-col justify-end">

      {/* ── Footer Preview ── */}
      <div className="bg-[#0B0D17] text-white">

        {/* Main footer grid */}
        <div
          className="px-5 pt-5 pb-4 gap-4"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr 1fr",
          }}
        >
          {/* Col 1: Brand */}
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-black text-white">{companyName}</p>
            <p className="text-[10px] text-white/60 leading-relaxed">{shortDescription}</p>
            {showSocialLinks && (
              <div className="flex items-center gap-2 mt-1">
                {socialIcons.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 hover:bg-[#6C47FF] transition-colors"
                  >
                    <Icon className="h-3 w-3 text-white" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-black text-white mb-1">{topListHeading}</p>
            {quickLinkLabels.length > 0 ? (
              quickLinkLabels.map((label) => (
                <p key={label} className="text-[10px] text-white/60 hover:text-white cursor-pointer transition-colors">
                  {label}
                </p>
              ))
            ) : (
              <p className="text-[10px] text-white/30 italic">No pages selected</p>
            )}
          </div>

          {/* Col 3: Contact + Newsletter */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-black text-white mb-1">Contact Us</p>
            <div className="flex items-start gap-1.5">
              <Phone className="h-3 w-3 mt-0.5 shrink-0 text-[#6C47FF]" />
              <p className="text-[10px] text-white/60">{mobile}</p>
            </div>
            <div className="flex items-start gap-1.5">
              <Mail className="h-3 w-3 mt-0.5 shrink-0 text-[#6C47FF]" />
              <p className="text-[10px] text-white/60">{email}</p>
            </div>
            <div className="flex items-start gap-1.5">
              <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-[#6C47FF]" />
              <p className="text-[10px] text-white/60 leading-relaxed">{address}</p>
            </div>
            {newsletterEnabled && (
              <div className="mt-2 flex gap-1">
                <input
                  type="email"
                  placeholder="Your email"
                  readOnly
                  className="flex-1 rounded-l-md bg-white/10 px-2 py-1 text-[9px] text-white placeholder:text-white/40 outline-none"
                />
                <div className="rounded-r-md bg-[#6C47FF] px-2 py-1 text-[9px] font-bold text-white cursor-pointer">
                  Subscribe
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className="border-t border-white/10 px-5 py-2.5 flex flex-wrap items-center justify-between gap-1">
          <p className="text-[9px] text-white/40">{copyright}</p>
          <p className="text-[9px] text-white/30">{poweredBy}</p>
        </div>

      </div>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Footer Settings"
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
      howItWorksLabel="How It Works"
      onHowItWorks={() => alert("This is where you'd explain how to use the footer editor.")}
    />
  );
}