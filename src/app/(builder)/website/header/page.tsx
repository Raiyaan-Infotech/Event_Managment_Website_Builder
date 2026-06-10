"use client";

import * as React from "react";
import {
  Camera,
  Edit2,
  Facebook,
  GripVertical,
  Instagram,
  Phone,
  Share2,
  Trash2,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PrimaryButton } from "@/components/ui/button";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { ImageUpload } from "../_components/image-upload";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
  BuilderSegmentedControl,
} from "../_components/builder-field";
import { FormActions } from "../_components/form-actions";

// ── Types ─────────────────────────────────────────────────────────────────────

type ContactType = "default" | "alternative";

interface SocialLink {
  id: string;
  label: string;
  url: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

// ── Initial Data ──────────────────────────────────────────────────────────────

const initialSocialLinks: SocialLink[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    url: "https://wa.me/919876543210",
    color: "#25D366",
    icon: Phone,
  },
  {
    id: "instagram",
    label: "Instagram",
    url: "https://instagram.com/royalmoments",
    color: "#E4405F",
    icon: Instagram,
  },
  {
    id: "facebook",
    label: "Facebook",
    url: "https://facebook.com/royalmoments",
    color: "#1877F2",
    icon: Facebook,
  },
  {
    id: "youtube",
    label: "YouTube",
    url: "https://youtube.com/@royalmoments",
    color: "#FF0000",
    icon: Youtube,
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WebsiteHeaderPage() {
  const [companyName, setCompanyName] = React.useState("Royal Moments Events");
  const [city, setCity] = React.useState("New Delhi, India");
  const [contactType, setContactType] = React.useState<ContactType>("default");
  const [mobile, setMobile] = React.useState("+91 98765 43210");
  const [email, setEmail] = React.useState("info@royalmoments.com");
  const [address, setAddress] = React.useState(
    "123, Wedding Avenue, Connaught Place, New Delhi - 110001",
  );
  const [socialLinks, setSocialLinks] =
    React.useState<SocialLink[]>(initialSocialLinks);
  const [isSaving, setIsSaving] = React.useState(false);

  const updateSocialLink = (
    id: string,
    patch: Partial<Pick<SocialLink, "url">>,
  ) => {
    setSocialLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const deleteSocialLink = (id: string) => {
    setSocialLinks((prev) => prev.filter((item) => item.id !== id));
  };

  const addSocialLink = () => {
    setSocialLinks((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        label: "New Link",
        url: "https://",
        color: "#6C47FF",
        icon: Share2,
      },
    ]);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  // ── Form ──────────────────────────────────────────────────────────────────

  const form = (
    <div className="space-y-4">

      {/* Page heading */}
      <div className="mb-2 px-1">
        <h2 className="text-[14px] font-black text-[var(--vendor-text)]">
          Basic Information
        </h2>
        <p className="text-[10px] font-medium text-[var(--vendor-text-muted)]">
          Manage your website basic information and header settings.
        </p>
      </div>

      {/* ── Top row: Company Info + Contact Info ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

        {/* ── 1. Company Information ── */}
        <FormSection
          title="Company Information"
          icon={<Camera className="h-[18px] w-[18px]" />}
          subtitle="Update your company details and logo."
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 shadow-sm space-y-3"
        >
          <ImageUpload
            compact
            label="Company Logo"
            title="Upload Logo"
            browseText="PNG, JPG or SVG"
            hint="Max. 2MB"
            size="wide"
          />

          <BuilderCountedInput
            label="Company Name"
            required
            value={companyName}
            onChange={setCompanyName}
            maxLength={100}
            className="space-y-0.5"
          />

          <BuilderCountedInput
            label="City"
            required
            value={city}
            onChange={setCity}
            maxLength={100}
            className="space-y-0.5"
          />
        </FormSection>

        {/* ── 2. Contact Information ── */}
        <FormSection
          title="Contact Information"
          icon={<Phone className="h-[18px] w-[18px]" />}
          subtitle="Update how your customers can reach you."
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 shadow-sm space-y-3"
        >
          <BuilderSegmentedControl
            label="Contact Type"
            value={contactType}
            onChange={(v) => setContactType(v as ContactType)}
            options={[
              { label: "Default", value: "default" },
              { label: "Alternative", value: "alternative" },
            ]}
          />

          <div className="grid grid-cols-2 gap-3">
            <BuilderCountedInput
              label="Mobile"
              required
              value={mobile}
              onChange={setMobile}
              maxLength={20}
              className="space-y-0.5"
            />
            <BuilderCountedInput
              label="Email"
              required
              value={email}
              onChange={setEmail}
              maxLength={100}
              className="space-y-0.5"
            />
          </div>

          <BuilderCountedTextarea
            label="Address"
            required
            value={address}
            onChange={setAddress}
            maxLength={200}
            textareaClassName="min-h-[64px] resize-none"
            className="space-y-0.5"
          />
        </FormSection>
      </div>

      {/* ── 3. Social Media Links ── */}
      <FormSection
        title="Social Media Links"
        subtitle="Add and manage your social media profiles. These will appear in your website header/footer."
        icon={<Share2 className="h-[18px] w-[18px]" />}
        actions={
          <PrimaryButton
            type="button"
            size="sm"
            onClick={addSocialLink}
            className="h-8 px-3 text-[11px] gap-1"
          >
            + Add Link
          </PrimaryButton>
        }
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-4 shadow-sm space-y-3"
      >
        {/* Social link rows */}
        <div className="rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] divide-y divide-[var(--vendor-border)]">
          {socialLinks.length === 0 ? (
            <p className="py-6 text-center text-[10px] text-[var(--vendor-text-muted)]">
              No social links yet. Click "+ Add Link" to add one.
            </p>
          ) : (
            socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-2.5"
                >
                  {/* Drag handle */}
                  <GripVertical className="h-4 w-4 shrink-0 text-[var(--vendor-text-muted)] cursor-grab" />

                  {/* Coloured icon badge */}
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  {/* Platform name */}
                  <span className="w-[88px] shrink-0 text-[11px] font-semibold text-[var(--vendor-text)]">
                    {item.label}
                  </span>

                  {/* URL input */}
                  <Input
                    value={item.url}
                    onChange={(e) =>
                      updateSocialLink(item.id, { url: e.target.value })
                    }
                    className="h-7 flex-1 min-w-0 text-[10px] font-medium px-2 font-mono"
                  />

                  {/* Edit / Delete */}
                  <div className="flex shrink-0 gap-1">
                    <Button type="button" variant="outline" size="icon-xs">
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-xs"
                      className="text-rose-500 hover:text-rose-600"
                      onClick={() => deleteSocialLink(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </FormSection>

      {/* ── Save / Cancel ── */}
      <FormActions
        saveLabel="Save Changes"
        onSave={handleSave}
        isSaving={isSaving}
        layout="end"
        className="pt-1"
      />
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Header"
      hideHeader={true}
      form={form}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
    />
  );
}