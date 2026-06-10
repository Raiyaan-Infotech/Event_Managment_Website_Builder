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
import { ImageUpload } from "../_components/image-upload";
import { MultiSelectPages } from "../_components/multi-select-pages";
import { ToggleField } from "../_components/toggle-field";
import { OutlineButton } from "@/components/ui/button";

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

const defaultOgImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="45%" stop-color="#7c3aed"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.65"/>
          <stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <rect width="1200" height="630" fill="url(#glow)"/>
      <circle cx="220" cy="230" r="80" fill="#f97316" opacity=".65"/>
      <circle cx="925" cy="190" r="58" fill="#f97316" opacity=".75"/>
    </svg>
  `);

export default function SEOPage() {
  const [metaTitle, setMetaTitle] = React.useState(
    "Eventify – Best Event Management & Planning Services",
  );
  const [metaDescription, setMetaDescription] = React.useState(
    "Eventify offers top-notch event management and planning services for weddings, corporate events, birthdays, and more. Let us make your moments unforgettable.",
  );
  const [keywords, setKeywords] = React.useState([
    "event management",
    "event planning",
    "wedding events",
    "corporate events",
    "birthday parties",
  ]);
  const [ogImage, setOgImage] = React.useState(defaultOgImage);
  const [robotsMeta, setRobotsMeta] = React.useState("index-follow");
  const [canonicalUrl, setCanonicalUrl] = React.useState(
    "https://www.eventify.com",
  );
  const [author, setAuthor] = React.useState("Eventify Team");
  const [language, setLanguage] = React.useState("en");
  const [siteName, setSiteName] = React.useState("Eventify");
  const [sitemapEnabled, setSitemapEnabled] = React.useState(true);
  const [structuredData, setStructuredData] = React.useState(false);
  const objectUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const handleOgImageSelect = (file: File) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const nextUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextUrl;
    setOgImage(nextUrl);
  };

  const form = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">

      {/* ── LEFT: Metadata Information ─────────────────────────── */}
      <FormSection
        title="Metadata Information"
        subtitle="Optimize how your website appears in search results."
        icon={<FileText className="h-4 w-4" />}
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm"
      >
        <BuilderCountedInput
          label="Meta Title"
          value={metaTitle}
          onChange={setMetaTitle}
          maxLength={60}
        />

        <BuilderCountedTextarea
          label="Meta Description"
          value={metaDescription}
          onChange={setMetaDescription}
          maxLength={160}
          textareaClassName="min-h-[60px]"
        />

        <MultiSelectPages
          label="Keywords"
          value={keywords}
          options={keywordOptions}
          onChange={setKeywords}
          placeholder="Add keyword"
          allowCustomValues
          customPlaceholder="Enter keyword"
          description="Add relevant keywords separated by commas or enter key and press enter."
        />

        {/* OG Image */}
        <div className="space-y-1.5">
          <ImageUpload
            label="OG Image"
            compact
            title="Drag & drop your image here"
            browseText="or click to browse"
            hint="JPG, PNG (max. 5MB)"
            size="wide"
            onFileSelect={handleOgImageSelect}
          />
          <div className="flex items-center justify-between rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-1.5">
            <div className="flex min-w-0 items-center gap-2">
              <img
                src={ogImage}
                alt="OG thumbnail"
                className="h-7 w-11 rounded object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="truncate text-[10px] font-bold text-[var(--vendor-text)]">
                  og-image.jpg
                </p>
                <p className="text-[9px] font-medium text-[var(--vendor-text-muted)]">
                  1200 × 630px (245 KB)
                </p>
              </div>
            </div>
            <OutlineButton
              type="button"
              size="icon-xs"
              onClick={() => {
                if (objectUrlRef.current)
                  URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
                setOgImage(defaultOgImage);
              }}
              className="text-rose-500 hover:text-rose-600 shrink-0"
            >
              <Trash2 className="h-3 w-3" />
            </OutlineButton>
          </div>
        </div>
      </FormSection>

      {/* ── RIGHT: Additional Settings ─────────────────────────── */}
      <FormSection
        title="Additional Settings"
        subtitle="Configure indexing, authorship, and technical SEO options."
        icon={<Settings2 className="h-4 w-4" />}
        className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm"
      >
        {/* Robots Meta — segmented so it matches the "Index, Follow" pill UI */}
        <BuilderSegmentedControl
          label="Robots Meta"
          value={robotsMeta}
          onChange={setRobotsMeta}
          options={robotsOptions}
          layout="grid"
        />

        <BuilderCountedInput
          label="Canonical URL"
          value={canonicalUrl}
          onChange={setCanonicalUrl}
          maxLength={200}
          placeholder="https://www.example.com"
        />

        <BuilderCountedInput
          label="Author"
          value={author}
          onChange={setAuthor}
          maxLength={80}
          placeholder="Your name or team"
        />

        {/* Language — segmented control */}
        <BuilderSegmentedControl
          label="Language"
          value={language}
          onChange={setLanguage}
          options={languageOptions}
          layout="grid"
        />

        <BuilderCountedInput
          label="Site Name"
          value={siteName}
          onChange={setSiteName}
          maxLength={60}
          placeholder="Your brand name"
        />

        <ToggleField
          label="Enable Sitemap"
          description="Automatically generate and submit sitemap.xml"
          checked={sitemapEnabled}
          onCheckedChange={setSitemapEnabled}
        />

        <ToggleField
          label="Structured Data"
          description="Add JSON-LD schema markup for rich search results"
          checked={structuredData}
          onCheckedChange={setStructuredData}
        />

        {/* Tip callout */}
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
  );

  return (
    <WebsiteBuilderLayout
      title="SEO Settings"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings", href: "/website" },
        { label: "SEO Settings" },
      ]}
      form={form}
      saveLabel="Save Changes"
      leftClassName="border-0 bg-transparent p-0 shadow-none"
    />
  );
}