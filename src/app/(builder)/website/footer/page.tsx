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

function LockedInput({ value }: { value: string }) {
  return (
    <div className="relative">
      <Input value={value} readOnly className="h-9 bg-slate-50 pr-9 text-[11px]" />
      <Lock className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function FooterPreview({
  companyName,
  shortDescription,
  topListHeading,
  selectedPages,
  newsletterEnabled,
  mobile,
  email,
  address,
  copyright,
  poweredBy,
  showSocialLinks,
}: {
  companyName: string;
  shortDescription: string;
  topListHeading: string;
  selectedPages: string[];
  newsletterEnabled: boolean;
  mobile: string;
  email: string;
  address: string;
  copyright: string;
  poweredBy: string;
  showSocialLinks: boolean;
}) {
  const links = selectedPages
    .map((value) => pageOptions.find((option) => option.value === value)?.label)
    .filter(Boolean) as string[];

  return (
    <footer className="rounded-[var(--vendor-radius-panel)] bg-[#061a39] px-10 py-10 text-white shadow-sm">
      <div className="grid gap-8 grid-cols-1 xl:grid-cols-[1.3fr_0.85fr_1fr]">
        <div>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[var(--vendor-radius-panel)] border border-white/20 bg-white/5">
              <span className="text-lg font-black">{companyName.slice(0, 2).toUpperCase()}</span>
            </div>
            <h2 className="text-[28px] font-black tracking-tight">{companyName}</h2>
          </div>

          <p className="mt-7 max-w-sm text-[15px] font-medium leading-7 text-white/85">
            {shortDescription}
          </p>

          <div className="mt-8 space-y-5 text-[15px] font-medium text-white/90">
            <p className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0" />
              <span>{address}</span>
            </p>
            <p className="flex items-center gap-4">
              <Phone className="h-5 w-5" />
              <span>{mobile}</span>
            </p>
            <p className="flex items-center gap-4">
              <Mail className="h-5 w-5" />
              <span>{email}</span>
            </p>
          </div>

          {showSocialLinks ? (
            <div className="mt-8 flex gap-4">
              {socialPreviewItems.map((item) => {
                const Icon = item.icon;
                return (
                  <span
                    key={item.label}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="border-l border-white/20 pl-10">
          <h3 className="text-[17px] font-black uppercase tracking-wide">{topListHeading}</h3>
          <div className="mt-7 space-y-5 text-[15px] font-medium text-white/85">
            {(links.length ? links : ["Sample Page", "Terms & Conditions", "Privacy Policy"]).map((link) => (
              <p key={link}>{link}</p>
            ))}
          </div>
        </div>

        <div className="border-l border-white/20 pl-10">
          <h3 className="text-[17px] font-black uppercase tracking-wide">Newsletter</h3>
          <p className="mt-7 text-[15px] font-medium leading-7 text-white/85">
            Subscribe to our newsletter for the latest updates and exclusive offers.
          </p>
          {newsletterEnabled ? (
            <div className="mt-7 space-y-4">
              <div className="h-14 rounded-[var(--vendor-radius-control)] border border-white/20 bg-white/5 px-5 text-[15px] leading-[3.5rem] text-white/55">
                Enter your email
              </div>
              <button
                type="button"
                className="h-14 w-full rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)] text-[15px] font-black text-white"
              >
                Subscribe
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-white/20 pt-7 text-[15px] font-medium text-white/85 lg:flex-row lg:items-center lg:justify-between">
        <p>{copyright}</p>
        <p>{poweredBy}</p>
      </div>
    </footer>
  );
}

export default function FooterPage() {
  const [companyName, setCompanyName] = React.useState("Eventify");
  const [shortDescription, setShortDescription] = React.useState(
    "Creating unforgettable experiences with creativity, precision, and passion. We turn your moments into lasting memories.",
  );
  const [showSocialLinks, setShowSocialLinks] = React.useState(true);
  const [topListHeading, setTopListHeading] = React.useState("Quick Links");
  const [selectedPages, setSelectedPages] = React.useState(["sample-page", "terms", "privacy"]);
  const [newsletterEnabled, setNewsletterEnabled] = React.useState(true);
  const [contactType, setContactType] = React.useState<ContactType>("default");
  const [mobile, setMobile] = React.useState("+1 234 567 8900");
  const [email, setEmail] = React.useState("hello@eventify.com");
  const [address, setAddress] = React.useState("123 Celebration Street, Event City, New York, NY 10001, USA");

  const copyright = "© 2026 EventCraft Pro. All rights reserved.";
  const poweredBy = "Powered by Raiyaan Infotech";

  const form = (
    <div className="space-y-5">
      <FormSection title="Company Information" divider>
        <BuilderCountedInput
          label="Company Name"
          value={companyName}
          onChange={setCompanyName}
          maxLength={100}
        />
        <BuilderCountedTextarea
          label="Short Description"
          value={shortDescription}
          onChange={setShortDescription}
          maxLength={200}
          textareaClassName="min-h-20"
        />
        <ImageUpload
          label="Company Logo"
          title="Drag & drop your logo here"
          browseText="or click to browse"
          hint="PNG, JPG, SVG"
          recommendedSize="(Max. 2MB)"
          size="wide"
        />
      </FormSection>

      <FormSection title="Social Links" divider>
        <ToggleField
          label="Show Social Links"
          checked={showSocialLinks}
          onCheckedChange={setShowSocialLinks}
          className="border-0 bg-transparent p-0"
        />
      </FormSection>

      <FormSection title="Footer Top List" divider>
        <BuilderCountedInput
          label="Top List Heading"
          value={topListHeading}
          onChange={setTopListHeading}
          maxLength={80}
        />
        <MultiSelectPages
          label="Add Pages"
          value={selectedPages}
          options={pageOptions}
          onChange={setSelectedPages}
          placeholder="Add page"
        />
      </FormSection>

      <FormSection title="Newsletter" divider>
        <label className="flex items-center gap-2 text-[12px] font-black text-[var(--vendor-text)]">
          <input
            type="checkbox"
            checked={newsletterEnabled}
            onChange={(event) => setNewsletterEnabled(event.target.checked)}
            className="h-4 w-4 accent-[var(--vendor-primary-btn)]"
          />
          Enable Newsletter
        </label>
      </FormSection>

      <FormSection title="Contact Info" divider>
        <BuilderSegmentedControl<ContactType>
          label="Contact Type"
          value={contactType}
          onChange={setContactType}
          options={[
            { label: "Default", value: "default" },
            { label: "Alternative", value: "alternative" },
          ]}
          className="[&>div]:grid [&>div]:grid-cols-2"
        />
        <BuilderCountedInput label="Mobile" value={mobile} onChange={setMobile} maxLength={30} />
        <BuilderCountedInput label="Email" value={email} onChange={setEmail} maxLength={100} />
        <BuilderCountedTextarea
          label="Address"
          value={address}
          onChange={setAddress}
          maxLength={200}
          textareaClassName="min-h-20"
        />
      </FormSection>

      <FormSection title="Footer Bottom">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-600">Copyright</p>
            <LockedInput value={copyright} />
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-wide text-slate-600">Powered By</p>
            <LockedInput value={poweredBy} />
          </div>
        </div>
      </FormSection>
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
      preview={
  <div className="overflow-hidden rounded-[var(--vendor-radius-panel)]">
    <div style={{ transform: "scale(0.65)", transformOrigin: "top left", width: "153.8%", pointerEvents: "none" }}>
      <FooterPreview
        companyName={companyName}
        shortDescription={shortDescription}
        topListHeading={topListHeading}
        selectedPages={selectedPages}
        newsletterEnabled={newsletterEnabled}
        mobile={mobile}
        email={email}
        address={address}
        copyright={copyright}
        poweredBy={poweredBy}
        showSocialLinks={showSocialLinks}
      />
    </div>
  </div>
}
      previewTitle="Footer Preview"
      previewSubtitle="This is how your footer will appear on the website."
      saveLabel="Save Changes"
      contentClassName="xl:grid-cols-[minmax(360px,32fr)_minmax(0,68fr)]"
    />
  );
}
