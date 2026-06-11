"use client";

import * as React from "react";
import {
  Camera,
  Check,
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
  const [editingLinkId, setEditingLinkId] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const updateSocialLink = (
    id: string,
    patch: Partial<SocialLink>,
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

  const handleCancel = () => {
    setCompanyName("Royal Moments Events");
    setCity("New Delhi, India");
    setContactType("default");
    setMobile("+91 98765 43210");
    setEmail("info@royalmoments.com");
    setAddress("123, Wedding Avenue, Connaught Place, New Delhi - 110001");
    setSocialLinks(initialSocialLinks);
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

      {/* ── Top row: Company Info + Contact Info ──
          Single column on mobile/tablet, 2-col on lg+
          Using minmax(0,1fr) so neither column can overflow its track. */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">

        {/* ── 1. Company Information ── */}
        <FormSection
          title="Company Information"
          icon={<Camera className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" />}
          subtitle="Update your company details and logo."
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-3 sm:p-4"
        >
          <ImageUpload
            label="Company Logo"
            recommendedSize="200x200px"
            maxFileSize="2MB"
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
          icon={<Phone className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" />}
          subtitle="Update how your customers can reach you."
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-3 sm:p-4"
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

          {/* Mobile + Email: stack on xs, side-by-side on sm+ */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
        subtitle="Add and manage your social media profiles."
        icon={<Share2 className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" />}
        actions={
          <PrimaryButton
            type="button"
            size="sm"
            onClick={addSocialLink}
            className="h-7 px-2.5 text-[10px] gap-1 sm:h-8 sm:px-3 sm:text-[11px]"
          >
            + Add Link
          </PrimaryButton>
        }
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm space-y-3 sm:p-4"
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
                  className="flex flex-col gap-2 px-2.5 py-2 sm:flex-row sm:items-center sm:gap-3"
                >
                  {/* Row 1 (mobile): handle + icon + label + action buttons */}
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    {/* Drag handle */}
                    <GripVertical className="h-3.5 w-3.5 shrink-0 text-[var(--vendor-text-muted)] cursor-grab" />

                    {/* Coloured icon badge */}
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-white sm:h-8 sm:w-8 sm:rounded-[8px]"
                      style={{ backgroundColor: item.color }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>

                    {/* Platform name — fixed width so URL input aligns */}
                    {editingLinkId === item.id ? (
                      <Input
                        value={item.label}
                        onChange={(e) =>
                          updateSocialLink(item.id, { label: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setEditingLinkId(null);
                        }}
                        className="h-7 w-[76px] px-1 text-[10px] sm:w-[88px] sm:text-[11px]"
                        autoFocus
                      />
                    ) : (
                      <span className="w-[76px] shrink-0 text-[10px] font-semibold text-[var(--vendor-text)] sm:w-[88px] sm:text-[11px]">
                        {item.label}
                      </span>
                    )}

                    {/* Edit / Delete — inline on mobile (right-aligned) */}
                    <div className="ml-auto flex shrink-0 gap-1 sm:hidden">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        onClick={() =>
                          setEditingLinkId(
                            editingLinkId === item.id ? null : item.id,
                          )
                        }
                      >
                        {editingLinkId === item.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Edit2 className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        className="text-rose-500 hover:text-rose-600"
                        onClick={() => deleteSocialLink(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Row 2 (mobile) / inline (sm+): URL input */}
                  <Input
                    value={item.url}
                    onChange={(e) =>
                      updateSocialLink(item.id, { url: e.target.value })
                    }
                    // Full width on mobile so it's easy to type in
                    className="h-7 w-full min-w-0 flex-1 px-2 font-mono text-[10px] font-medium"
                  />

                  {/* Edit / Delete — sm+ only, inline after the URL input */}
                  <div className="hidden shrink-0 gap-1 sm:flex">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-xs"
                      onClick={() =>
                        setEditingLinkId(
                          editingLinkId === item.id ? null : item.id,
                        )
                      }
                    >
                      {editingLinkId === item.id ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Edit2 className="h-3.5 w-3.5" />
                      )}
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
      {/* <FormActions
        saveLabel="Save Changes"
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        layout="end"
        className="pt-1"
      /> */}
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Header"
      form={form}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
      leftClassName="border-0 bg-transparent p-0 shadow-none"
    />
  );
}