"use client";

import * as React from "react";
import { Palette } from "lucide-react";
import { OutlineButton } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  useSaveWebsiteSettings,
  useWebsiteBuilderData,
} from "@/hooks/use-website-builder";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { ColorPickerInput } from "../_components/color-picker-input";
import { FormSection } from "../_components/form-section";
import { BuilderLabel, BuilderSelectField } from "../_components/builder-field";
import { ADMIN_THEME_COLORS } from "@/components/website-preview/sections/preview-shared";
import type { WebsiteColorPalette } from "@/lib/website-builder-api";

type ThemeColorKey =
  | "primary_bg_color"
  | "primary_text_color"
  | "secondary_text_color"
  | "paragraph_color";

type ThemeColors = Record<ThemeColorKey, string>;

const SWATCH_KEYS: ThemeColorKey[] = [
  "primary_bg_color",
  "primary_text_color",
  "secondary_text_color",
  "paragraph_color",
];

const COLOR_LABELS: Record<ThemeColorKey, string> = {
  primary_bg_color: "Primary Color",
  primary_text_color: "Primary Text Color",
  secondary_text_color: "Secondary Text Color",
  paragraph_color: "Paragraph text Color",
};

const DEFAULT_CUSTOM: ThemeColors = {
  primary_bg_color: ADMIN_THEME_COLORS.primaryBg,
  primary_text_color: ADMIN_THEME_COLORS.primaryText,
  secondary_text_color: ADMIN_THEME_COLORS.secondaryText,
  paragraph_color: ADMIN_THEME_COLORS.paragraph,
};

// CUSTOM sentinel palette id
const CUSTOM_ID = -1;

function parseSettingsRecord(value: unknown): Record<string, unknown> {
  if (!value) return {};
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Record<string, unknown>;
  } catch {
    return {};
  }
}

// 4-square swatch bar used in the dropdown row
function SwatchBar({ colors }: { colors: string[] }) {
  return (
    <span className="flex shrink-0 gap-1">
      {colors.map((c, i) => (
        <span
          key={i}
          className="h-5 w-5 rounded-[4px] border border-slate-200"
          style={{ backgroundColor: c || "#e5e7eb" }}
        />
      ))}
    </span>
  );
}

function paletteSwatches(palette: WebsiteColorPalette): string[] {
  return SWATCH_KEYS.map((k) => (palette[k] as string) || "#e5e7eb");
}

export default function ThemeColorPage() {
  const { data: builderData } = useWebsiteBuilderData();
  const saveWebsiteSettings = useSaveWebsiteSettings();
  const { showToast } = useToast();

  const palettes = React.useMemo(
    () => builderData?.colorPalettes || [],
    [builderData],
  );

  const loadedRef = React.useRef(false);

  // selectedId: palette.id, or CUSTOM_ID for custom
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [pendingId, setPendingId] = React.useState<number | null>(null); // dropdown selection before Apply
  const [customColors, setCustomColors] = React.useState<ThemeColors>(DEFAULT_CUSTOM);
  const [isSaving, setIsSaving] = React.useState(false);

  const isCustom = selectedId === CUSTOM_ID;
  const isPendingCustom = pendingId === CUSTOM_ID;

  const selectedPalette = palettes.find((p) => p.id === selectedId) ?? null;
  const pendingPalette = palettes.find((p) => p.id === pendingId) ?? null;

  // All items: real palettes + Custom at the end
  const allItems = React.useMemo(
    () => [
      ...palettes,
      { id: CUSTOM_ID, name: "Custom", isCustom: true } as WebsiteColorPalette & { isCustom?: boolean },
    ],
    [palettes],
  );

  // Load saved state once
  React.useEffect(() => {
    if (loadedRef.current || !builderData) return;
    const website = builderData.website as Record<string, unknown> | null | undefined;
    const settings = parseSettingsRecord(website?.settings_json);
    const colors = parseSettingsRecord(settings.colors);
    const useCustom = Boolean(settings.use_custom_colors);

    if (useCustom) {
      setSelectedId(CUSTOM_ID);
      setPendingId(CUSTOM_ID);
      setCustomColors({
        primary_bg_color: String(colors.primary_bg_color || DEFAULT_CUSTOM.primary_bg_color),
        primary_text_color: String(colors.primary_text_color || DEFAULT_CUSTOM.primary_text_color),
        secondary_text_color: String(colors.secondary_text_color || DEFAULT_CUSTOM.secondary_text_color),
        paragraph_color: String(colors.paragraph_color || DEFAULT_CUSTOM.paragraph_color),
      });
    } else {
      const savedId = settings.palette_id != null ? Number(settings.palette_id) : null;
      setSelectedId(savedId);
      setPendingId(savedId);
    }
    loadedRef.current = true;
  }, [builderData]);

  // Default to first palette once loaded
  React.useEffect(() => {
    if (selectedId == null && palettes.length) {
      setSelectedId(palettes[0].id);
      setPendingId(palettes[0].id);
    }
  }, [selectedId, palettes]);

  const handleApply = () => {
    setSelectedId(pendingId);
  };

  const updateCustom = (key: ThemeColorKey, value: string) => {
    setCustomColors((c) => ({ ...c, [key]: value }));
  };

  const getDisplayColors = (): ThemeColors => {
    if (isCustom) return customColors;
    if (!selectedPalette) return DEFAULT_CUSTOM;
    return {
      primary_bg_color: (selectedPalette.primary_bg_color as string) || DEFAULT_CUSTOM.primary_bg_color,
      primary_text_color: (selectedPalette.primary_text_color as string) || DEFAULT_CUSTOM.primary_text_color,
      secondary_text_color: (selectedPalette.secondary_text_color as string) || DEFAULT_CUSTOM.secondary_text_color,
      paragraph_color: (selectedPalette.paragraph_color as string) || DEFAULT_CUSTOM.paragraph_color,
    };
  };

  const displayColors = getDisplayColors();

  const handleSave = async () => {
    const website = builderData?.website as Record<string, unknown> | null | undefined;
    const existingSettings = parseSettingsRecord(website?.settings_json);
    setIsSaving(true);
    try {
      await saveWebsiteSettings.mutateAsync({
        settings_json: {
          ...existingSettings,
          use_custom_colors: isCustom,
          palette_id: isCustom ? null : selectedId,
          colors: isCustom ? customColors : existingSettings.colors,
        },
        is_active: true,
      });
      showToast("Theme Color saved");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to save Theme Color settings",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedId(palettes[0]?.id ?? null);
    setPendingId(palettes[0]?.id ?? null);
    setCustomColors(DEFAULT_CUSTOM);
  };

  const form = (
    <div className="space-y-4">
      <FormSection
        title="Theme Color"
        icon={<Palette className="h-4 w-4 text-[var(--vendor-primary-btn)]" />}
      >
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
          <BuilderSelectField
            label="Color Palette"
            value={String(pendingId ?? "")}
            onChange={(value) => setPendingId(Number(value))}
            options={allItems.map((item) => ({
              label: item.name,
              value: String(item.id),
            }))}
            triggerClassName="h-10 text-[12px]"
          />

          <div className="flex h-10 items-center">
            {isPendingCustom ? (
              <SwatchBar colors={SWATCH_KEYS.map((k) => customColors[k])} />
            ) : pendingPalette ? (
              <SwatchBar colors={paletteSwatches(pendingPalette)} />
            ) : null}
          </div>

          <OutlineButton
            type="button"
            size="sm"
            onClick={handleApply}
            disabled={pendingId === selectedId}
            className="h-10 shrink-0 px-4 text-[12px]"
          >
            Apply
          </OutlineButton>
        </div>
      </FormSection>

      <FormSection
        title={
          isCustom
            ? "Custom Colors"
            : selectedPalette
              ? selectedPalette.name
              : "Palette Colors"
        }
      >
        <div className="divide-y divide-[var(--vendor-border)]">
          {SWATCH_KEYS.map((key) => {
            const value = displayColors[key];
            return (
              <div
                key={key}
                className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
              >
                <BuilderLabel className="text-[12px] text-slate-700">
                  {COLOR_LABELS[key]}
                </BuilderLabel>

                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className="h-6 w-6 shrink-0 rounded-[4px] border border-slate-200"
                    style={{ backgroundColor: value }}
                  />
                  {isCustom ? (
                    <div className="w-[130px]">
                      <ColorPickerInput
                        value={value}
                        onChange={(next) => updateCustom(key, next)}
                        compact
                      />
                    </div>
                  ) : (
                    <span className="w-[130px] rounded-[6px] border border-[var(--vendor-border)] bg-slate-50 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase text-slate-500">
                      {value}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </FormSection>
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Theme Color"
      subtitle="Pick an admin color palette or define your own custom colors."
      form={form}
      onSave={handleSave}
      onReset={handleReset}
      isSaving={isSaving}
      saveLabel="Save Changes"
    />
  );
}
