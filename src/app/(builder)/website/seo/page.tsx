"use client";

import * as React from "react";
import { Trash2, Info, FileText, Settings2 } from "lucide-react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { FormSection } from "../_components/form-section";
import {
  BuilderCountedInput,
  BuilderCountedTextarea,
  BuilderSegmentedControl,
} from "../_components/builder-field";
import { ConfirmDeleteButton } from "../_components/confirm-delete-button";
import { ImageUpload } from "../_components/image-upload";
import { ImageCropper } from "../_components/image-cropper-lazy";
import { MultiSelectPages } from "../_components/multi-select-pages";
import { ToggleField } from "../_components/toggle-field";
import {
  useSaveSeo,
  useUploadVendorMedia,
  useWebsiteBuilderData,
} from "@/hooks/use-website-builder";
import { useToast } from "@/components/ui/toast";
import { resolveMediaUrl } from "@/lib/utils";

const keywordOptions = [
  { label: "event management", value: "event management" },
  { label: "event planning", value: "event planning" },
  { label: "wedding events", value: "wedding events" },
  { label: "corporate events", value: "corporate events" },
  { label: "birthday parties", value: "birthday parties" },
  { label: "contact us", value: "contact us" },
];

const robotsOptions = [
  { label: "Index, Follow", value: "index-follow" },
  { label: "NoIndex, NoFollow", value: "noindex-nofollow" },
  { label: "Index, NoFollow", value: "index-nofollow" },
  { label: "NoIndex, Follow", value: "noindex-follow" },
];

const languageOptions = [
  { label: "English (en)", value: "en" },
  { label: "Spanish (es)", value: "es" },
  { label: "French (fr)", value: "fr" },
  { label: "German (de)", value: "de" },
  { label: "Tamil (ta)", value: "ta" },
];

type SeoFormState = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  robotsMeta: string;
  canonicalUrl: string;
  author: string;
  language: string;
  siteName: string;
  sitemapEnabled: boolean;
  structuredData: boolean;
};

const DEFAULT_SEO_STATE: SeoFormState = {
  metaTitle: "Eventify - Best Event Management & Planning Services",
  metaDescription:
    "Eventify offers top-notch event management and planning services for weddings, corporate events, birthdays, and more. Let us make your moments unforgettable.",
  keywords: [
    "event management",
    "event planning",
    "wedding events",
    "corporate events",
    "birthday parties",
  ],
  ogImage: "",
  robotsMeta: "index-follow",
  canonicalUrl: "https://www.eventify.com",
  author: "Eventify Team",
  language: "en",
  siteName: "Eventify",
  sitemapEnabled: true,
  structuredData: false,
};

function normalizeKeywords(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return DEFAULT_SEO_STATE.keywords;
}

function mapRobotsMeta(seo: Record<string, unknown>) {
  const robotsIndex = Number(seo.robots_index ?? 1);
  const robotsFollow = Number(seo.robots_follow ?? 1);

  if (!robotsIndex && !robotsFollow) return "noindex-nofollow";
  if (robotsIndex && !robotsFollow) return "index-nofollow";
  if (!robotsIndex && robotsFollow) return "noindex-follow";
  return "index-follow";
}

function buildSeoState(seo?: Record<string, unknown> | null): SeoFormState {
  if (!seo) return DEFAULT_SEO_STATE;

  return {
    metaTitle: String(seo.default_title || DEFAULT_SEO_STATE.metaTitle),
    metaDescription: String(
      seo.default_description || DEFAULT_SEO_STATE.metaDescription,
    ),
    keywords: normalizeKeywords(seo.default_keywords),
    ogImage: String(seo.og_image_url || ""),
    robotsMeta: mapRobotsMeta(seo),
    canonicalUrl: String(seo.canonical_url || DEFAULT_SEO_STATE.canonicalUrl),
    author: String(seo.author || DEFAULT_SEO_STATE.author),
    language: String(seo.language || DEFAULT_SEO_STATE.language),
    siteName: String(seo.site_name || DEFAULT_SEO_STATE.siteName),
    sitemapEnabled: Boolean(
      seo.sitemap_enabled ?? DEFAULT_SEO_STATE.sitemapEnabled,
    ),
    structuredData: Boolean(
      seo.structured_data_enabled ?? DEFAULT_SEO_STATE.structuredData,
    ),
  };
}

export default function SEOPage() {
  const { data: builderData } = useWebsiteBuilderData();
  const saveSeo = useSaveSeo();
  const uploadVendorMedia = useUploadVendorMedia();
  const { showToast } = useToast();
  const objectUrlRef = React.useRef<string | null>(null);
  const loadedFromApiRef = React.useRef(false);
  const [formState, setFormState] = React.useState<SeoFormState>(DEFAULT_SEO_STATE);
  const [pendingOgImageFile, setPendingOgImageFile] = React.useState<File | null>(null);
  const [cropperOpen, setCropperOpen] = React.useState(false);
  const [imageToCrop, setImageToCrop] = React.useState("");
  const [activeCropFile, setActiveCropFile] = React.useState<File | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (loadedFromApiRef.current || !builderData) return;
    setFormState(buildSeoState(builderData.seo));
    loadedFromApiRef.current = true;
  }, [builderData]);

  const updateField = <K extends keyof SeoFormState>(key: K, value: SeoFormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const clearOgImage = React.useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPendingOgImageFile(null);
    updateField("ogImage", "");
  }, []);

  const handleOgImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setActiveCropFile(file);
      setImageToCrop(String(reader.result || ""));
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBase64: string) => {
    if (!activeCropFile) {
      setCropperOpen(false);
      setImageToCrop("");
      return;
    }

    const response = await fetch(croppedBase64);
    const blob = await response.blob();
    const extension = activeCropFile.name.includes(".")
      ? activeCropFile.name.slice(activeCropFile.name.lastIndexOf("."))
      : ".jpg";
    const croppedFile = new File(
      [blob],
      `${activeCropFile.name.replace(/\.[^.]+$/, "")}-cropped${extension}`,
      { type: blob.type || activeCropFile.type || "image/jpeg" },
    );

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const nextUrl = URL.createObjectURL(croppedFile);
    objectUrlRef.current = nextUrl;
    setPendingOgImageFile(croppedFile);
    updateField("ogImage", nextUrl);
    setCropperOpen(false);
    setImageToCrop("");
    setActiveCropFile(null);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      let ogImageUrl = formState.ogImage.trim();

      if (pendingOgImageFile) {
        const uploaded = await uploadVendorMedia.mutateAsync({
          file: pendingOgImageFile,
          folder: "website/seo",
        });
        ogImageUrl = uploaded.url;
      }

      await saveSeo.mutateAsync({
        metaTitle: formState.metaTitle.trim(),
        metaDescription: formState.metaDescription.trim(),
        keywords: formState.keywords.join(", "),
        ogImage: ogImageUrl || null,
        robotsMeta: formState.robotsMeta,
        canonicalUrl: formState.canonicalUrl.trim(),
        author: formState.author.trim(),
        language: formState.language,
        siteName: formState.siteName.trim(),
        sitemapEnabled: formState.sitemapEnabled,
        structuredData: formState.structuredData,
      });

      setPendingOgImageFile(null);
      updateField("ogImage", ogImageUrl);
      showToast("SEO settings saved");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to save SEO settings",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setPendingOgImageFile(null);
    setCropperOpen(false);
    setImageToCrop("");
    setActiveCropFile(null);
    setFormState({
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      ogImage: "",
      robotsMeta: "",
      canonicalUrl: "",
      author: "",
      language: "",
      siteName: "",
      sitemapEnabled: false,
      structuredData: false,
    });
  };

  const ogImagePreview = formState.ogImage.startsWith("blob:")
    ? formState.ogImage
    : resolveMediaUrl(formState.ogImage);

  const form = (
    <div className="space-y-3">
      <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
        <FormSection
          title="Metadata Information"
          subtitle="Optimize how your website appears in search results."
          icon={<FileText className="h-4 w-4" />}
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm"
        >
          <BuilderCountedInput
            label="Meta Title"
            value={formState.metaTitle}
            onChange={(value) => updateField("metaTitle", value)}
            maxLength={60}
          />

          <BuilderCountedTextarea
            label="Meta Description"
            value={formState.metaDescription}
            onChange={(value) => updateField("metaDescription", value)}
            maxLength={160}
            textareaClassName="min-h-[60px]"
          />

          <MultiSelectPages
            label="Keywords"
            value={formState.keywords}
            options={keywordOptions}
            onChange={(value) => updateField("keywords", value)}
            placeholder="Add keyword"
            allowCustomValues
            customPlaceholder="Enter keyword"
            description="Add relevant keywords separated by commas or enter key and press enter."
          />

          <div className="space-y-1.5">
            <ImageUpload
              label="OG Image"
              value={ogImagePreview}
              recommendedSize="1200x630px"
              maxFileSize="2MB"
              maxSizeMb={2}
              onFileSelect={handleOgImageSelect}
            />

            {ogImagePreview ? (
              <div className="flex items-center justify-between gap-2 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-1.5">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <img
                    src={ogImagePreview}
                    alt="OG thumbnail"
                    className="h-7 w-11 shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[10px] font-bold text-[var(--vendor-text)]">
                      {pendingOgImageFile?.name || "og-image.jpg"}
                    </p>
                    <p className="text-[9px] font-medium text-[var(--vendor-text-muted)]">
                      1200 x 630px
                    </p>
                  </div>
                </div>

                <ConfirmDeleteButton
                  onConfirm={clearOgImage}
                  itemLabel={pendingOgImageFile?.name || "OG image"}
                  title="Delete image?"
                  description="This will permanently remove the current OG image from SEO settings."
                  className="shrink-0 text-rose-500 hover:text-rose-600"
                >
                  <Trash2 className="h-3 w-3" />
                </ConfirmDeleteButton>
              </div>
            ) : null}
          </div>
        </FormSection>

        <FormSection
          title="Additional Settings"
          subtitle="Configure indexing, authorship, and technical SEO options."
          icon={<Settings2 className="h-4 w-4" />}
          className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm"
        >
          <BuilderSegmentedControl
            label="Robots Meta"
            value={formState.robotsMeta}
            onChange={(value) => updateField("robotsMeta", value)}
            options={robotsOptions}
            layout="grid"
          />

          <BuilderCountedInput
            label="Canonical URL"
            value={formState.canonicalUrl}
            onChange={(value) => updateField("canonicalUrl", value)}
            maxLength={200}
            placeholder="https://www.example.com"
          />

          <BuilderCountedInput
            label="Author"
            value={formState.author}
            onChange={(value) => updateField("author", value)}
            maxLength={80}
            placeholder="Your name or team"
          />

          <BuilderSegmentedControl
            label="Language"
            value={formState.language}
            onChange={(value) => updateField("language", value)}
            options={languageOptions}
            layout="grid"
          />

          <BuilderCountedInput
            label="Site Name"
            value={formState.siteName}
            onChange={(value) => updateField("siteName", value)}
            maxLength={60}
            placeholder="Your brand name"
          />

          <ToggleField
            label="Enable Sitemap"
            description="Automatically generate and submit sitemap.xml"
            checked={formState.sitemapEnabled}
            onCheckedChange={(checked) => updateField("sitemapEnabled", checked)}
          />

          <ToggleField
            label="Structured Data"
            description="Add JSON-LD schema markup for rich search results"
            checked={formState.structuredData}
            onCheckedChange={(checked) => updateField("structuredData", checked)}
          />

          <div className="flex items-start gap-2 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-primary-btn)]/5 p-2.5">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--vendor-primary-btn)]" />
            <p className="text-[9.5px] font-medium leading-4 text-[var(--vendor-text-muted)]">
              <span className="font-bold text-[var(--vendor-text)]">Tip:</span>{" "}
              Keep your meta title within 60 characters and description within 160
              characters for the best SEO results.
            </p>
          </div>
        </FormSection>
      </div>
    </div>
  );

  return (
    <>
      <WebsiteBuilderLayout
        title="SEO Settings"
        form={form}
        saveLabel="Save Changes"
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        leftClassName="border-0 bg-transparent p-0 shadow-none"
      />
      <ImageCropper
        open={cropperOpen}
        imageSrc={imageToCrop}
        onClose={() => {
          setCropperOpen(false);
          setImageToCrop("");
          setActiveCropFile(null);
        }}
        onCropComplete={(croppedImageBase64) => {
          void handleCropComplete(croppedImageBase64);
        }}
        aspectRatio={1200 / 630}
        outputWidth={1200}
        outputHeight={630}
        title="Crop OG Image"
      />
    </>
  );
}
