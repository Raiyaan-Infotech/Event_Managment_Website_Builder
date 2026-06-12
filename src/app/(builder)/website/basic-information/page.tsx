"use client";

import * as React from "react";
import {
  Facebook,
  Instagram,
  Phone,
  Share2,
  Trash2,
  Youtube,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button, OutlineButton, PrimaryButton } from "@/components/ui/button";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { ImageUpload } from "../_components/image-upload";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
  BuilderSegmentedControl,
} from "../_components/builder-field";
import { ColorPickerInput } from "../_components/color-picker-input";

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

// ── Shared table header ───────────────────────────────────────────────────────

const SocialTableHead = () => (
  <thead>
    <tr className="border-b border-[var(--vendor-border)]">
      <th className="py-1.5 pl-1 pr-2 text-left text-[10px] font-semibold text-[var(--vendor-text-muted)]">
        Icon
      </th>
      <th className="py-1.5 px-2 text-left text-[10px] font-semibold text-[var(--vendor-text-muted)]">
        Icon Color
      </th>
      <th className="py-1.5 px-2 text-left text-[10px] font-semibold text-[var(--vendor-text-muted)]">
        Label
      </th>
      <th className="py-1.5 px-2 text-left text-[10px] font-semibold text-[var(--vendor-text-muted)]">
        URL
      </th>
      <th className="py-1.5 pl-2 pr-1 text-left text-[10px] font-semibold text-[var(--vendor-text-muted)]">
        Action
      </th>
    </tr>
  </thead>
);

// ── Page ──────────────────────────────────────────────────────────────────────

export default function WebsiteBasicInformationPage() {
  const [companyName, setCompanyName] = React.useState("Royal Moments Events");
  const [city, setCity] = React.useState("New Delhi, India");
  const [contactType, setContactType] = React.useState<ContactType>("default");
  const [mobile, setMobile] = React.useState("98765 43210");
  const [email, setEmail] = React.useState("info@royalmoments.com");
  const [address, setAddress] = React.useState(
    "123, Wedding Avenue, Connaught Place, New Delhi - 110001",
  );
  const [socialLinks, setSocialLinks] =
    React.useState<SocialLink[]>(initialSocialLinks);
  const [isSaving, setIsSaving] = React.useState(false);

  const MAX_LINKS = 10;
  const leftLinks = socialLinks.slice(0, 5);
  const rightLinks = socialLinks.slice(5, 10);
  const hasRightPanel = socialLinks.length > 5;
  const canAddMore = socialLinks.length < MAX_LINKS;

  const updateSocialLink = (id: string, patch: Partial<SocialLink>) => {
    setSocialLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const deleteSocialLink = (id: string) => {
    setSocialLinks((prev) => prev.filter((item) => item.id !== id));
  };

  const addSocialLink = () => {
    if (!canAddMore) return;
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

  const handleCancel = () => {
    setCompanyName("Royal Moments Events");
    setCity("New Delhi, India");
    setContactType("default");
    setMobile("98765 43210");
    setEmail("info@royalmoments.com");
    setAddress("123, Wedding Avenue, Connaught Place, New Delhi - 110001");
    setSocialLinks(initialSocialLinks);
  };

  // ── Render rows helper (inline, no custom component) ─────────────────────

  const renderRows = (rows: SocialLink[]) =>
    rows.map((item) => {
      const Icon = item.icon;
      return (
        <tr key={item.id} className="group">
          {/* Icon badge */}
          <td className="py-2 pl-1 pr-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-[6px] text-white"
              style={{ backgroundColor: item.color }}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
          </td>

          {/* Icon Color */}
          <td className="py-2 px-2 align-top">
            <ColorPickerInput
              value={item.color}
              onChange={(val) => updateSocialLink(item.id, { color: val })}
              compact
              className="w-[150px]"
            />
          </td>

          {/* Label */}
          <td className="py-2 px-2 align-top">
            <BuilderCountedInput
              value={item.label}
              onChange={(val) => updateSocialLink(item.id, { label: val })}
              maxLength={40}
              className="space-y-0"
              inputClassName="h-7 min-w-0 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white pl-2 pr-12 shadow-xs"
            />
          </td>

          {/* URL */}
          <td className="py-2 px-2">
            <BuilderCountedInput
              value={item.url}
              onChange={(val) => updateSocialLink(item.id, { url: val })}
              maxLength={300}
              className="space-y-0"
            />
          </td>

          {/* Action */}
          <td className="py-2 pl-2 pr-1">
            <div className="flex items-center gap-1">
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
          </td>
        </tr>
      );
    });

  // ── Form ──────────────────────────────────────────────────────────────────

  const form = (
    <div className="space-y-4">
      {/* Page heading */}
      <div className="px-1">
        <h2 className="text-[14px] font-black text-[var(--vendor-text)]">
          Basic Information
        </h2>
        <p className="text-[10px] font-medium text-[var(--vendor-text-muted)]">
          Manage your website basic information and Basic Information settings.
        </p>
      </div>

      {/* ── 1 & 2. Header Information + Contact Information — combined row ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Header Information */}
        <FormSection
          title="Header Information"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm sm:p-4"
        >
          <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
            <div className="flex flex-col items-center">
              <ImageUpload
                label="Company Logo"
                recommendedSize="200x200px"
                maxFileSize="2MB"
              />
            </div>

            <div className="space-y-3">
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
            </div>
          </div>
        </FormSection>

        {/* Contact Information */}
        <FormSection
          title="Contact Information"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-3 sm:p-4"
        >
          <BuilderSegmentedControl
            label="Type"
            value={contactType}
            onChange={(v) => setContactType(v as ContactType)}
            options={[
              { label: "Default", value: "default" },
              { label: "Alternative", value: "alternative" },
            ]}
          />

          <div className="grid grid-cols-2 gap-3 items-start">
            <BuilderCountedInput
              label="Mobile"
              required
              value={mobile}
              onChange={setMobile}
              maxLength={20}
              className="space-y-0.5"
              inputPrefix={
                <div className="flex h-full shrink-0 items-center gap-1 border-r border-[var(--vendor-border)] bg-[var(--vendor-input-bg)] px-2">
                  <span className="text-[13px]">🇮🇳</span>
                  <span className="text-[10px] font-semibold text-[var(--vendor-text)]">
                    +91
                  </span>
                </div>
              }
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
            textareaClassName="min-h-[64px] resize-y"
            className="space-y-0.5"
          />
        </FormSection>
      </div>

      {/* ── 3. Social Links ── */}
      <FormSection
        title="Social Links"
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm sm:p-4"
      >
        {socialLinks.length === 0 ? (
          <div className="py-6 text-center text-[10px] text-[var(--vendor-text-muted)]">
            No social links yet. Click &quot;+ Add Social Link&quot; to add one.
          </div>
        ) : (
          <div
            className={`grid gap-0 ${
              hasRightPanel
                ? "grid-cols-2 divide-x divide-[var(--vendor-border)]"
                : "grid-cols-1"
            }`}
          >
            {/* Left panel — rows 1–5 */}
            <div className={hasRightPanel ? "pr-3" : ""}>
              <div className="overflow-x-auto rounded-[var(--vendor-radius-control)]">
                <table className="w-full table-fixed text-[11px]">
                  <colgroup>
                    <col className="w-[44px]" />
                    <col className="w-[170px]" />
                    <col className="w-[120px]" />
                    <col />
                    <col className="w-[44px]" />
                  </colgroup>
                  <SocialTableHead />
                  <tbody className="divide-y divide-[var(--vendor-border)]">
                    {renderRows(leftLinks)}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right panel — rows 6–10 */}
            {hasRightPanel && (
              <div className="pl-3">
                <div className="overflow-x-auto rounded-[var(--vendor-radius-control)]">
                  <table className="w-full table-fixed text-[11px]">
                    <colgroup>
                      <col className="w-[44px]" />
                      <col className="w-[170px]" />
                      <col className="w-[120px]" />
                      <col />
                      <col className="w-[44px]" />
                    </colgroup>
                    <SocialTableHead />
                    <tbody className="divide-y divide-[var(--vendor-border)]">
                      {renderRows(rightLinks)}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer: + Add button + count */}
        <div className="pt-2 flex items-center justify-between">
          <OutlineButton
            type="button"
            size="xs"
            onClick={addSocialLink}
            disabled={!canAddMore}
            className="text-[11px] font-semibold text-[var(--vendor-primary)] border-[var(--vendor-primary)]/30 hover:bg-[var(--vendor-primary)]/5 hover:border-[var(--vendor-primary)]/50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + Add Social Link
          </OutlineButton>

          <span className="text-[10px] text-[var(--vendor-text-muted)]">
            {socialLinks.length}/{MAX_LINKS} links
          </span>
        </div>
      </FormSection>

      <div className="flex justify-end gap-2 mt-2">
        <PrimaryButton
          type="button"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </PrimaryButton>
      </div>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Basic Information"
      form={form}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
    />
  );
}