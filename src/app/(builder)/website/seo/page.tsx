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
    <div className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--vendor-primary-btn)]/10 text-[var(--vendor-primary-btn)]">
          <CalendarDays className="h-5 w-5" />
        </span>
        <div>
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--vendor-text)]">
            <span>https://www.eventify.com</span>
            <span className="text-[10px]">⌄</span>
          </div>
        </div>
      </div>

      <h3 className="text-[20px] font-black leading-6 text-[var(--vendor-primary-btn)]">
        {metaTitle}
      </h3>
      <p className="mt-3 text-[14px] font-medium leading-6 text-[var(--vendor-text)]">
        {metaDescription}
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-[13px] font-medium text-[var(--vendor-text-muted)]">
        {keywords.slice(2, 6).map((keyword, index) => (
          <React.Fragment key={keyword}>
            {index > 0 ? <span>•</span> : null}
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
      <img src={ogImage} alt="Open graph preview" className="h-[250px] w-full object-cover" />
      <div className="p-5">
        <p className="text-[12px] font-bold uppercase tracking-wide text-[var(--vendor-text-muted)]">
          EVENTIFY.COM
        </p>
        <h3 className="mt-3 text-[20px] font-black leading-6 text-[var(--vendor-text)]">
          {metaTitle}
        </h3>
        <p className="mt-3 text-[14px] font-medium leading-6 text-[var(--vendor-text-muted)]">
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
    <div className="space-y-5">
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
        textareaClassName="min-h-[150px]"
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
      <div className="space-y-3">
        <ImageUpload
          label="OG Image"
          title="Drag & drop your image here"
          browseText="or click to browse"
          hint="Recommended size: 1200 x 630px"
          recommendedSize="(JPG, PNG)"
          size="wide"
          onFileSelect={handleOgImageSelect}
        />
        <div className="flex items-center justify-between rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-3">
          <div className="flex min-w-0 items-center gap-3">
            <img src={ogImage} alt="OG image thumbnail" className="h-12 w-20 rounded object-cover" />
            <div className="min-w-0">
              <p className="truncate text-[12px] font-black text-[var(--vendor-text)]">og-image.jpg</p>
              <p className="mt-0.5 text-[11px] font-medium text-[var(--vendor-text-muted)]">
                1200 x 630px (245 KB)
              </p>
            </div>
          </div>
          <OutlineButton
            type="button"
            size="icon-sm"
            onClick={() => {
              if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
              objectUrlRef.current = null;
              setOgImage(defaultOgImage);
            }}
            className="text-rose-500 hover:text-rose-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </OutlineButton>
        </div>
      </div>
    </div>
  );

  const preview = (
    <div className="rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-6">
      <section>
        <h2 className="text-[16px] font-black text-[var(--vendor-text)]">Google Search Preview</h2>
        <div className="mt-5 max-w-[650px]">
          <SearchPreview
            metaTitle={metaTitle}
            metaDescription={metaDescription}
            keywords={keywords}
          />
        </div>
      </section>

      <div className="my-8 border-t border-[var(--vendor-border)]" />

      <section>
        <h2 className="text-[16px] font-black text-[var(--vendor-text)]">Facebook / OG Preview</h2>
        <div className="mt-5 max-w-[760px]">
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
    />
  );
}
