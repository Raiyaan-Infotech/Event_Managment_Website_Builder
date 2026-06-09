"use client";

import * as React from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";
import { ImageUpload } from "../../_components/image-upload";
import { BuilderCountedInput } from "../../_components/builder-field";
import { PrimaryButton } from "@/components/ui/button";

interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
}

function logoDataUrl(name: string, color: string, accent: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="360" height="240" viewBox="0 0 360 240">
      <rect width="360" height="240" rx="24" fill="#ffffff"/>
      <text x="180" y="92" text-anchor="middle" font-family="Georgia, serif" font-size="58" font-weight="700" fill="${accent}">${initials}</text>
      <text x="180" y="147" text-anchor="middle" font-family="Inter, Arial" font-size="30" font-weight="800" letter-spacing="3" fill="${color}">${name.split(" ")[0].toUpperCase()}</text>
      <text x="180" y="181" text-anchor="middle" font-family="Inter, Arial" font-size="20" font-weight="600" letter-spacing="8" fill="${color}">${name.split(" ").slice(1).join(" ").toUpperCase() || "EVENTS"}</text>
    </svg>
  `)}`;
}

const initialSponsors: Sponsor[] = [
  { id: "1", name: "Platinum Events", logoUrl: logoDataUrl("Platinum Events", "#0f172a", "#b7791f") },
  { id: "2", name: "Dream Decor", logoUrl: logoDataUrl("Dream Decor", "#be185d", "#be185d") },
  { id: "3", name: "Elite Catering", logoUrl: logoDataUrl("Elite Catering", "#111827", "#c58a16") },
  { id: "4", name: "Media Connect", logoUrl: logoDataUrl("Media Connect", "#1e3a8a", "#4f46e5") },
  { id: "5", name: "Royal Stays", logoUrl: logoDataUrl("Royal Stays", "#172554", "#b7791f") },
  { id: "6", name: "Spark Lights", logoUrl: logoDataUrl("Spark Lights", "#111827", "#ea580c") },
  { id: "7", name: "Creative Prints", logoUrl: logoDataUrl("Creative Prints", "#111827", "#06b6d4") },
];

export default function PortfolioSponsorsPage() {
  const [sponsors, setSponsors] = React.useState<Sponsor[]>(initialSponsors);
  const [sponsorName, setSponsorName] = React.useState("");
  const [draftLogo, setDraftLogo] = React.useState<string | null>(null);
  const objectUrlsRef = React.useRef<string[]>([]);

  React.useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleLogoSelect = (file: File) => {
    if (draftLogo?.startsWith("blob:")) URL.revokeObjectURL(draftLogo);
    const nextUrl = URL.createObjectURL(file);
    objectUrlsRef.current.push(nextUrl);
    setDraftLogo(nextUrl);
  };

  const addSponsor = () => {
    const name = sponsorName.trim();
    if (!name) return;
    setSponsors((current) => [
      ...current,
      {
        id: `${Date.now()}`,
        name,
        logoUrl: draftLogo ?? logoDataUrl(name, "#0f172a", "#2563eb"),
      },
    ]);
    setSponsorName("");
    setDraftLogo(null);
  };

  const removeSponsor = (id: string) => {
    setSponsors((current) => current.filter((sponsor) => sponsor.id !== id));
  };

  const form = (
    <div className="space-y-3">
      {/* Add New Sponsor section */}
      <h2 className="text-[13px] font-black text-[var(--vendor-text)]">Add New Sponsor</h2>

      <ImageUpload
        key={draftLogo ?? "empty-sponsor-logo"}
        value={draftLogo}
        label="Upload Logo"
        title="Drag & drop sponsor logo here"
        browseText="or click to browse"
        hint="JPG, PNG, SVG or WebP · Max 2MB"
        recommendedSize=""
        size="wide"
        dropzoneClassName="h-[130px]"
        previewClassName="h-[130px]"
        onFileSelect={handleLogoSelect}
        onRemove={() => setDraftLogo(null)}
      />

      <BuilderCountedInput
        label="Sponsor Name"
        value={sponsorName}
        onChange={setSponsorName}
        maxLength={100}
        placeholder="Enter sponsor name"
      />

      <PrimaryButton type="button" onClick={addSponsor} className="w-full justify-center">
        + Add Sponsor
      </PrimaryButton>

      {/* Divider */}
      <div className="border-t border-[var(--vendor-border)]" />

      {/* Added Sponsors list */}
      <div className="space-y-1">
        <h2 className="text-[13px] font-black text-[var(--vendor-text)]">
          Added Sponsors ({sponsors.length})
        </h2>

        <div className="divide-y divide-[var(--vendor-border)]">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="flex items-center gap-3 py-2">
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-[var(--vendor-text-muted)]" />
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border border-[var(--vendor-border)] bg-white p-0.5">
                <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
              </div>
              <p className="min-w-0 flex-1 truncate text-[12px] font-semibold text-[var(--vendor-text)]">
                {sponsor.name}
              </p>
              <button
                type="button"
                onClick={() => removeSponsor(sponsor.id)}
                className="shrink-0 text-rose-500 transition-colors hover:text-rose-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <p className="pt-1 text-[11px] text-[var(--vendor-text-muted)]">
          You can upload up to 30 sponsors.
        </p>
      </div>
    </div>
  );

  const preview = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {sponsors.map((sponsor) => (
        <div
          key={sponsor.id}
          className="flex h-[130px] items-center justify-center rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-6"
        >
          <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
        </div>
      ))}
    </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Portfolio - Sponsors"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Portfolio", href: "/website/portfolio" },
        { label: "Sponsors" },
      ]}
      form={form}
      preview={preview}
      previewTitle="Live Preview"
      saveLabel="Save Changes"
      contentClassName="xl:grid-cols-[minmax(340px,32fr)_minmax(0,68fr)]"
    />
  );
}
