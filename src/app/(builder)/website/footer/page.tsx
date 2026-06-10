"use client";

import * as React from "react";
import {
  Facebook,
  Instagram,
  Lock,
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ContactType = "default" | "alternative";

const pageOptions = [
  { label: "Sample Page", value: "sample-page" },
  { label: "Terms & Conditions", value: "terms" },
  { label: "Privacy Policy", value: "privacy" },
  { label: "About Us", value: "about" },
  { label: "Contact Us", value: "contact" },
];

const socialPreviewItems = [
  { label: "Twitter", icon: Twitter },
  { label: "Instagram", icon: Instagram },
  { label: "Facebook", icon: Facebook },
  { label: "YouTube", icon: Youtube },
];

// ─── Locked read-only input ───────────────────────────────────────────────────

function LockedInput({ value }: { value: string }) {
  return (
    <div className="relative">
      <Input
        value={value}
        readOnly
        className="h-7 bg-slate-50 pr-8 text-[10px] text-slate-500"
      />
      <Lock className="absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FooterPage() {
  const [companyName, setCompanyName] = React.useState("Eventify");
  const [shortDescription, setShortDescription] = React.useState(
    "Creating unforgettable experiences with creativity, precision, and passion. We turn your moments into lasting memories.",
  );
  const [showSocialLinks, setShowSocialLinks] = React.useState(true);
  const [topListHeading, setTopListHeading] = React.useState("Quick Links");
  const [selectedPages, setSelectedPages] = React.useState([
    "sample-page",
    "terms",
    "privacy",
  ]);
  const [newsletterEnabled, setNewsletterEnabled] = React.useState(true);
  const [contactType, setContactType] = React.useState<ContactType>("default");
  const [mobile, setMobile] = React.useState("+1 234 567 8900");
  const [email, setEmail] = React.useState("hello@eventify.com");
  const [address, setAddress] = React.useState(
    "123 Celebration Street, Event City, New York, NY 10001, USA",
  );

  const copyright = "© 2026 EventCraft Pro. All rights reserved.";
  const poweredBy = "Powered by Raiyaan Infotech";

  const form = (
    <div className="grid h-full grid-cols-3 gap-2.5">

      {/* ── Column 1: Company Info ── */}
      <div className="flex flex-col gap-2 min-h-0 overflow-y-auto pr-0.5">

        {/* Company Information */}
        <FormSection
          title="Company Information"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-2.5 shadow-sm space-y-2"
        >
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
            textareaClassName="!min-h-[2.25rem] !max-h-[2.25rem] text-[10px]"
          />

          {/* Logo upload — extra compact */}
          <div className="space-y-1">
            <p className="text-[9px] font-semibold text-slate-600">Company Logo</p>
            <ImageUpload
              compact
              hint="JPG, PNG, SVG"
              recommendedSize="Max 2MB"
              browseText=""
              title="Upload Logo"
              size="sm"
              dropzoneClassName="h-10 w-full"
              className="space-y-0"
            />
          </div>
        </FormSection>

        {/* Footer Bottom — kept in col 1 but super compact */}
        <FormSection
          title="Footer Bottom"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-2.5 shadow-sm space-y-1.5"
        >
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-wide text-slate-500">
              Copyright
            </p>
            <LockedInput value={copyright} />
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-wide text-slate-500">
              Powered By
            </p>
            <LockedInput value={poweredBy} />
          </div>
        </FormSection>
      </div>

      {/* ── Column 2: Footer Settings ── */}
      <div className="flex flex-col gap-2 min-h-0 overflow-y-auto pr-0.5">
        <FormSection
          title="Footer Settings"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-2.5 shadow-sm space-y-2"
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

          {/* Newsletter checkbox — inline compact */}
          <label className="flex cursor-pointer items-center gap-2 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-slate-50/60 px-2.5 py-2">
            <input
              type="checkbox"
              checked={newsletterEnabled}
              onChange={(e) => setNewsletterEnabled(e.target.checked)}
              className="h-3.5 w-3.5 accent-[var(--vendor-primary-btn)]"
            />
            <div>
              <p className="text-[10px] font-bold text-[var(--vendor-text)]">
                Enable Newsletter
              </p>
              <p className="text-[9px] font-medium text-[var(--vendor-text-muted)]">
                Allow visitors to subscribe to your newsletter.
              </p>
            </div>
          </label>

          {/* Show Social Links toggle — compact */}
          <ToggleField
            label="Show Social Links"
            description="Display social media links in footer."
            checked={showSocialLinks}
            onCheckedChange={setShowSocialLinks}
            className="border border-[var(--vendor-border)] bg-slate-50/60 px-2.5 py-2 rounded-[var(--vendor-radius-control)]"
          />
        </FormSection>
      </div>

      {/* ── Column 3: Contact Info ── */}
      <div className="flex flex-col gap-2 min-h-0 overflow-y-auto pr-0.5">
        <FormSection
          title="Contact Info"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-2.5 shadow-sm space-y-2"
        >
          {/* Contact type segmented control */}
          <BuilderSegmentedControl<ContactType>
            label="Contact Type"
            value={contactType}
            onChange={setContactType}
            options={[
              { label: "Default", value: "default" },
              { label: "Alternative", value: "alternative" },
            ]}
            layout="grid"
          />

          {/* Mobile + Email side-by-side */}
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

          {/* Address textarea */}
          <BuilderCountedTextarea
            label="Address"
            value={address}
            onChange={setAddress}
            maxLength={200}
            textareaClassName="!min-h-[3rem] !max-h-[3rem] text-[10px]"
          />
        </FormSection>
      </div>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Footer Settings"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings", href: "/website" },
        { label: "Footer Settings" },
      ]}
      form={form}
      saveLabel="Save Changes"
    />
  );
}