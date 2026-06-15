"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { Trash2 } from "lucide-react";
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
import { IconPickerDialog } from "../_components/icon-picker-dialog";

// ── Types ─────────────────────────────────────────────────────────────────────

type ContactType = "default" | "alternative";

interface SocialLink {
  id: string;
  label: string;
  url: string;
  color: string;
  iconName: string;
}

// ── Initial Data ──────────────────────────────────────────────────────────────

const initialSocialLinks: SocialLink[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    url: "https://wa.me/919876543210",
    color: "#25D366",
    iconName: "simple-icons:whatsapp",
  },
  {
    id: "instagram",
    label: "Instagram",
    url: "https://instagram.com/royalmoments",
    color: "#E4405F",
    iconName: "simple-icons:instagram",
  },
  {
    id: "facebook",
    label: "Facebook",
    url: "https://facebook.com/royalmoments",
    color: "#1877F2",
    iconName: "simple-icons:facebook",
  },
  {
    id: "youtube",
    label: "YouTube",
    url: "https://youtube.com/@royalmoments",
    color: "#FF0000",
    iconName: "simple-icons:youtube",
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

// ── Active status badge ──────────────────────────────────────────────────────

const ActiveStatusBadge = () => (
  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-[var(--vendor-radius-control)] border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 sm:right-4 sm:top-4">
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
    Active
  </span>
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
  const [iconPickerLinkId, setIconPickerLinkId] = React.useState<string | null>(null);
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
        iconName: "simple-icons:linktree",
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

  const handleIconSelect = (iconName: string) => {
    if (!iconPickerLinkId) return;
    updateSocialLink(iconPickerLinkId, {
      iconName,
    });
  };

  // ── Render rows helper (inline, no custom component) ─────────────────────

  const renderRows = (rows: SocialLink[]) =>
    rows.map((item) => {
      return (
        <tr key={item.id} className="group">
          {/* Icon badge */}
          <td className="py-2 pl-1 pr-2">
            <button
              type="button"
              onClick={() => setIconPickerLinkId(item.id)}
              title="Choose icon"
              className="flex h-7 w-7 items-center justify-center rounded-[6px] text-white transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--vendor-primary-btn)]/30"
              style={{ backgroundColor: item.color }}
            >
              <Icon icon={item.iconName} className="h-3.5 w-3.5" />
            </button>
          </td>

          {/* Icon Color */}
          <td className="py-2 px-2 align-top">
            <ColorPickerInput
              value={item.color}
              onChange={(val) => updateSocialLink(item.id, { color: val })}
              compact
              className="w-full"
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
              inputClassName="h-7 min-w-0 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white pl-2 pr-14 shadow-xs"
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
      {/* ── 1 & 2. Header Information + Contact Information — combined row ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Header Information */}
        <FormSection
          title="Header Information"
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm sm:p-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[140px_1fr] sm:items-start">
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
          className="relative rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-3 sm:p-4"
        >
          <ActiveStatusBadge />

          <BuilderSegmentedControl
            label="Type"
            value={contactType}
            onChange={(v) => setContactType(v as ContactType)}
            options={[
              { label: "Default", value: "default" },
              { label: "Alternative", value: "alternative" },
            ]}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:items-start">
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
            className={`grid gap-3 ${
              hasRightPanel
                ? "grid-cols-1 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-[var(--vendor-border)]"
                : "grid-cols-1"
            }`}
          >
            {/* Left panel — rows 1–5 */}
            <div className={hasRightPanel ? "lg:pr-3" : ""}>
              <div className="overflow-x-auto rounded-[var(--vendor-radius-control)]">
                <table className="w-full min-w-[700px] table-fixed text-[11px]">
                  <colgroup>
                    <col className="w-[40px]" />
                    <col className="w-[140px]" />
                    <col className="w-[160px]" />
                    <col />
                    <col className="w-[40px]" />
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
              <div className="lg:pl-3">
                <div className="overflow-x-auto rounded-[var(--vendor-radius-control)]">
                  <table className="w-full min-w-[700px] table-fixed text-[11px]">
                    <colgroup>
                      <col className="w-[40px]" />
                      <col className="w-[140px]" />
                      <col className="w-[160px]" />
                      <col />
                      <col className="w-[40px]" />
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
    <>
      <WebsiteBuilderLayout
        title="Basic Information"
        form={form}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        leftClassName="border-0 bg-transparent p-0 shadow-none"
      />
      <IconPickerDialog
        open={Boolean(iconPickerLinkId)}
        onOpenChange={(open) => {
          if (!open) setIconPickerLinkId(null);
        }}
        onSelect={handleIconSelect}
      />
    </>
  );
}
