"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react";
import { OutlineButton } from "@/components/ui/button";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import { BuilderCountedInput } from "../_components/builder-field";
import { ColorPickerInput } from "../_components/color-picker-input";
import { ConfirmDeleteButton } from "../_components/confirm-delete-button";
import { ToggleField } from "../_components/toggle-field";
import {
  useSaveBasicInformation,
  useSaveSocialLinks,
  useWebsiteBuilderData,
} from "@/hooks/use-website-builder";
import { useToast } from "@/components/ui/toast";

// The icon picker is a modal only opened on demand — load it lazily so its
// icon-grid/search code stays out of this page's initial route chunk.
const IconPickerDialog = dynamic(
  () => import("../_components/icon-picker-dialog").then((m) => m.IconPickerDialog),
  { ssr: false },
);

interface SocialLink {
  id: string;
  label: string;
  url: string;
  color: string;
  iconName: string;
}

function mapBuilderSocialLinks(
  links: Array<{
    id?: string | number | null;
    icon_key?: string | null;
    label?: string | null;
    url?: string | null;
    icon_color?: string | null;
  }> = [],
): SocialLink[] {
  return links.map((link, index) => ({
    id: String(link.id || link.icon_key || `social-${index + 1}`),
    label: String(link.label || ""),
    url: String(link.url || ""),
    color: String(link.icon_color || "#1877F2"),
    iconName: String(link.icon_key || "simple-icons:linktree"),
  }));
}

function parseHeaderSettings(value: unknown) {
  const record = parseHeaderSettingsRecord(value);
  const fallback = {
    showSocialIcons: true,
  };

  return {
    showSocialIcons: Boolean(
      record.show_social_icons ??
        record.showSocialIcons ??
        fallback.showSocialIcons,
    ),
  };
}

function parseHeaderSettingsRecord(value: unknown) {
  if (!value) return {};

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return parsed as Record<string, unknown>;
  } catch {
    return {};
  }
}

const SocialTableHead = () => (
  <thead>
    <tr className="border-b border-[var(--vendor-border)]">
      <th className="py-1.5 pl-1 pr-2 text-left text-[10px] font-semibold text-[var(--vendor-text-muted)]">
        Icon
      </th>
      <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-[var(--vendor-text-muted)]">
        Icon Color
      </th>
      <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-[var(--vendor-text-muted)]">
        Label
      </th>
      <th className="px-2 py-1.5 text-left text-[10px] font-semibold text-[var(--vendor-text-muted)]">
        URL
      </th>
      <th className="py-1.5 pl-2 pr-1 text-left text-[10px] font-semibold text-[var(--vendor-text-muted)]">
        Action
      </th>
    </tr>
  </thead>
);

export default function WebsiteBasicInformationPage() {
  const { data: builderData } = useWebsiteBuilderData();
  const saveBasicInformation = useSaveBasicInformation();
  const saveSocialLinks = useSaveSocialLinks();
  const { showToast } = useToast();

  const loadedHeaderRef = React.useRef(false);
  const [showSocialIcons, setShowSocialIcons] = React.useState(true);
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>([]);
  const [iconPickerLinkId, setIconPickerLinkId] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const MAX_LINKS = 10;
  const leftLinks = socialLinks.slice(0, 5);
  const rightLinks = socialLinks.slice(5, 10);
  const hasRightPanel = socialLinks.length > 5;
  const canAddMore = socialLinks.length < MAX_LINKS;

  const applyBuilderData = React.useCallback(() => {
    const basicInformation = builderData?.basicInformation as
      | Record<string, unknown>
      | null
      | undefined;
    const settings = parseHeaderSettings(
      basicInformation?.social_links_json,
    );
    setShowSocialIcons(Boolean(basicInformation?.show_social_icons ?? settings.showSocialIcons));
    setMobileNumber(String(basicInformation?.mobile || ""));
    setEmail(String(basicInformation?.email || "").toLowerCase());
    setSocialLinks(mapBuilderSocialLinks(builderData?.socialLinks));
  }, [builderData]);

  React.useEffect(() => {
    if (loadedHeaderRef.current || !builderData) return;
    applyBuilderData();
    loadedHeaderRef.current = true;
  }, [applyBuilderData, builderData]);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        saveBasicInformation.mutateAsync({
          mobile_country_code: "+91",
          mobile: mobileNumber.trim(),
          email: email.trim().toLowerCase(),
          show_social_icons: showSocialIcons,
          social_links_json: {
            ...parseHeaderSettingsRecord(
              (builderData?.basicInformation as Record<string, unknown> | null | undefined)
                ?.social_links_json,
            ),
            show_social_icons: showSocialIcons,
          },
          is_active: true,
        }),
        saveSocialLinks.mutateAsync(
          socialLinks.map((link, index) => ({
            icon: link.iconName,
            color: link.color,
            label: link.label,
            url: link.url,
            sort_order: index + 1,
            is_active: true,
          })),
        ),
      ]);
      showToast("Header saved");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to save header",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setShowSocialIcons(false);
    setMobileNumber("");
    setEmail("");
    setSocialLinks([]);
    setIconPickerLinkId(null);
  };

  const handleIconSelect = (iconName: string) => {
    if (!iconPickerLinkId) return;
    updateSocialLink(iconPickerLinkId, { iconName });
  };

  const renderRows = (rows: SocialLink[]) =>
    rows.map((item) => (
      <tr key={item.id} className="group">
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
        <td className="px-2 py-2 align-top">
          <ColorPickerInput
            value={item.color}
            onChange={(val) => updateSocialLink(item.id, { color: val })}
            compact
            className="w-full"
          />
        </td>
        <td className="px-2 py-2 align-top">
          <BuilderCountedInput
            value={item.label}
            onChange={(val) => updateSocialLink(item.id, { label: val })}
            maxLength={40}
            className="space-y-0"
            inputClassName="h-7 min-w-0 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white pl-2 pr-12 shadow-xs"
          />
        </td>
        <td className="px-2 py-2">
          <BuilderCountedInput
            value={item.url}
            onChange={(val) => updateSocialLink(item.id, { url: val })}
            maxLength={300}
            className="space-y-0"
            inputClassName="h-7 min-w-0 rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white pl-2 pr-14 shadow-xs"
          />
        </td>
        <td className="py-2 pl-2 pr-1">
          <ConfirmDeleteButton
            className="text-rose-500 hover:text-rose-600"
            itemLabel={item.label || "Social link"}
            onConfirm={() => deleteSocialLink(item.id)}
          />
        </td>
      </tr>
    ));

  const form = (
    <div className="space-y-4">
      <FormSection
        title="Header Settings"
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm sm:p-4"
      >
        <div className="grid gap-3">
          <ToggleField
            label="Social Icons"
            description="Show or hide social icons in the website header."
            checked={showSocialIcons}
            onCheckedChange={setShowSocialIcons}
          />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <BuilderCountedInput
            label="Mobile Number"
            value={mobileNumber}
            onChange={setMobileNumber}
            maxLength={20}
            inputPrefix={
              <div className="flex h-full shrink-0 items-center gap-1 border-r border-[var(--vendor-border)] bg-[var(--vendor-input-bg)] px-2">
                <span className="text-[10px] font-semibold text-[var(--vendor-text)]">
                  +91
                </span>
              </div>
            }
          />
          <BuilderCountedInput
            label="Email"
            value={email}
            onChange={setEmail}
            maxLength={100}
          />
        </div>
      </FormSection>

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

            {hasRightPanel ? (
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
            ) : null}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <OutlineButton
            type="button"
            size="xs"
            onClick={addSocialLink}
            disabled={!canAddMore}
            className="border-[var(--vendor-primary)]/30 text-[11px] font-semibold text-[var(--vendor-primary)] hover:border-[var(--vendor-primary)]/50 hover:bg-[var(--vendor-primary)]/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Add Social Link
          </OutlineButton>

          <span className="text-[10px] text-[var(--vendor-text-muted)]">
            {socialLinks.length}/{MAX_LINKS} links
          </span>
        </div>
      </FormSection>
    </div>
  );

  return (
    <>
      <WebsiteBuilderLayout
        title="Header"
        form={form}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        leftClassName="border-0 bg-transparent p-0 shadow-none"
        primaryButton={{
          label: "Save Changes",
          onClick: handleSave,
          isLoading: isSaving,
        }}
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
