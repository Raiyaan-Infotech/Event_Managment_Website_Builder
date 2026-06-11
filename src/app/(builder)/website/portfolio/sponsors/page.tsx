"use client";

import * as React from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";
import { FormSection } from "../../_components/form-section";
import { ImageUpload } from "../../_components/image-upload";
import { BuilderCountedInput } from "../../_components/builder-field";
import { FormActions } from "../../_components/form-actions";
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
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleCancel = () => {
    setSponsors(initialSponsors);
    setSponsorName("");
    setDraftLogo(null);
  };

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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-4 space-y-5">
        <FormSection title="Add New Sponsor">
          <ImageUpload
            key={draftLogo ?? "empty-sponsor-logo"}
            value={draftLogo ?? undefined}
            label="Sponsor Logo"
            recommendedSize="300x200px"
            maxFileSize="2MB"
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

          <PrimaryButton type="button" onClick={addSponsor} className="w-full justify-center mt-2">
            + Add Sponsor
          </PrimaryButton>
        </FormSection>
      </div>

      <div className="lg:col-span-8 space-y-5">
        <FormSection title={`Added Sponsors (${sponsors.length})`}>
          {sponsors.length > 0 ? (
            <div className="divide-y divide-[var(--vendor-border)]">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="flex items-center gap-3 py-3">
                  <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-[var(--vendor-text-muted)]" />
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white p-1">
                    <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <p className="min-w-0 flex-1 truncate text-[13px] font-bold text-[var(--vendor-text)]">
                    {sponsor.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeSponsor(sponsor.id)}
                    className="shrink-0 text-rose-500 transition-colors hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50"
                    aria-label={`Delete ${sponsor.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[180px] flex-col items-center justify-center rounded-[var(--vendor-radius-panel)] border border-dashed border-[var(--vendor-border)] bg-slate-50/50 p-6 text-center">
              <p className="text-[12px] font-bold text-[var(--vendor-text-muted)]">No sponsors added yet</p>
              <p className="text-[11px] text-[var(--vendor-text-muted)] mt-1">Use the panel on the left to add sponsor details and logos.</p>
            </div>
          )}
          <p className="pt-2 text-[10px] text-[var(--vendor-text-muted)]">
            You can upload up to 30 sponsors.
          </p>
        </FormSection>
      </div>
    </div>

    {/* ── Bottom Save / Cancel ── */}
    {/* <FormActions
      saveLabel="Save Changes"
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
      layout="end"
    /> */}
  </div>
  );

  return (
    <WebsiteBuilderLayout
      title="Portfolio - Sponsors"
      form={form}
      saveLabel="Save Changes"
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
    />
  );
}
