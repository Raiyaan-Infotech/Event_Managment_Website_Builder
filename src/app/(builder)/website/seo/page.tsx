"use client";

import * as React from "react";
import { CalendarDays, Trash2 } from "lucide-react";
import { WebsiteBuilderLayout } from "../_components/website-builder-layout";
import { BuilderCountedInput, BuilderCountedTextarea } from "../_components/builder-field";
import { ImageUpload } from "../_components/image-upload";
import { MultiSelectPages } from "../_components/multi-select-pages";
import { OutlineButton } from "@/components/ui/button";

const keywordOptions = [
  { label: "event management", value: "event management" },
  { label: "event planning", value: "event planning" },
  { label: "wedding events", value: "wedding events" },
  { label: "corporate events", value: "corporate events" },
  { label: "birthday parties", value: "birthday parties" },
  { label: "contact us", value: "contact us" },
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
      <circle cx="310" cy="220" r="42" fill="#f59e0b" opacity=".75"/>
      <circle cx="925" cy="190" r="58" fill="#f97316" opacity=".75"/>
      <circle cx="1010" cy="195" r="38" fill="#facc15" opacity=".7"/>
      <rect x="0" y="410" width="1200" height="220" fill="#020617" opacity=".5"/>
      <path d="M530 250c65-85 190-78 250 12 48 72 18 178-70 210-92 34-215-11-250-104-16-43-1-83 70-118Z" fill="#f9a8d4" opacity=".7"/>
      <path d="M395 390c120-80 300-100 450-20 78 42 145 108 205 190H175c48-68 119-124 220-170Z" fill="#111827" opacity=".45"/>
    </svg>
  `);

function SearchPreview({
  metaTitle,
  metaDescription,
  keywords,
}: {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}) {
  return (
    <div className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-3.5 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
          <CalendarDays className="h-4 w-4" />
        </span>
        <div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[var(--vendor-text)]">
            <span>https://www.eventify.com</span>
            <span className="text-[8px]">⌄</span>
          </div>
        </div>
      </div>

      <h3 className="text-[15px] font-bold leading-5 text-[var(--vendor-primary-btn)]">
        {metaTitle}
      </h3>
      <p className="mt-1.5 text-[11px] font-medium leading-4 text-slate-600">
        {metaDescription}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-medium text-[var(--vendor-text-muted)]">
        {keywords.slice(2, 6).map((keyword, index) => (
          <React.Fragment key={keyword}>
            {index > 0 ? <span className="mx-1">•</span> : null}
            <span>{keyword.replace(/\b\w/g, (char) => char.toUpperCase())}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function OgPreview({
  metaTitle,
  metaDescription,
  ogImage,
}: {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}) {
  return (
    <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white shadow-sm">
      <img src={ogImage} alt="Open graph preview" className="aspect-[1.91/1] w-full max-h-[145px] object-cover" />
      <div className="p-3">
        <p className="text-[9px] font-bold uppercase tracking-wide text-[var(--vendor-text-muted)]">
          EVENTIFY.COM
        </p>
        <h3 className="mt-1 text-[13px] font-extrabold leading-4 text-[var(--vendor-text)]">
          {metaTitle}
        </h3>
        <p className="mt-1 text-[10.5px] font-medium leading-4 text-[var(--vendor-text-muted)]">
          {metaDescription}
        </p>
      </div>
    </div>
  );
}

export default function SEOPage() {
  const [metaTitle, setMetaTitle] = React.useState("Eventify – Best Event Management & Planning Services");
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
    <div className="space-y-2.5">
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
        textareaClassName="min-h-[64px]"
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
      <div className="space-y-2">
        <ImageUpload
          label="OG Image"
          compact={true}
          title="Drag & drop your image here"
          browseText="or click to browse"
          hint="Recommended size: 1200 x 630px"
          recommendedSize="(JPG, PNG)"
          size="wide"
          onFileSelect={handleOgImageSelect}
        />
        <div className="flex items-center justify-between rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-2">
          <div className="flex min-w-0 items-center gap-2">
            <img src={ogImage} alt="OG image thumbnail" className="h-8 w-12 rounded object-cover" />
            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold text-[var(--vendor-text)]">og-image.jpg</p>
              <p className="mt-0.5 text-[9px] font-medium text-[var(--vendor-text-muted)]">
                1200 x 630px (245 KB)
              </p>
            </div>
          </div>
          <OutlineButton
            type="button"
            size="icon-xs"
            onClick={() => {
              if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
              objectUrlRef.current = null;
              setOgImage(defaultOgImage);
            }}
            className="text-rose-500 hover:text-rose-600"
          >
            <Trash2 className="h-3 w-3" />
          </OutlineButton>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="space-y-4">
      <section>
        <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Google Search Preview</h2>
        <div className="mt-1.5">
          <SearchPreview
            metaTitle={metaTitle}
            metaDescription={metaDescription}
            keywords={keywords}
          />
        </div>
      </section>

      <section>
        <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Facebook / OG Preview</h2>
        <div className="mt-1.5">
          <OgPreview
            metaTitle={metaTitle}
            metaDescription={metaDescription}
            ogImage={ogImage}
          />
        </div>
      </section>
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
      preview={preview}
      previewTitle="Preview"
      previewSubtitle="See how your content will look in search engines and when shared on social media."
      saveLabel="Save Changes"
      contentClassName="xl:grid-cols-[minmax(360px,32fr)_minmax(0,68fr)]"
      leftClassName="border-0 bg-transparent p-0 shadow-none"
    />
  );
}
