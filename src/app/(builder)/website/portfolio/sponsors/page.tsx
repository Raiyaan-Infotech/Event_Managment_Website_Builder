"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { WebsiteBuilderLayout } from "../../_components/website-builder-layout";
import { ImageUpload } from "../../_components/image-upload";
import { BuilderCountedInput } from "../../_components/builder-field";
import { Button } from "@/components/ui/button";
import { DraggableItemList, type DraggableItemListItem } from "../../_components/draggable-item-list";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
}

function logoDataUrl(name: string, color: string, accent: string) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2)
    .map((part) => part[0]?.toUpperCase()).join("");
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
  { id: "2", name: "Dream Decor",     logoUrl: logoDataUrl("Dream Decor",     "#be185d", "#be185d") },
  { id: "3", name: "Elite Catering",  logoUrl: logoDataUrl("Elite Catering",  "#111827", "#c58a16") },
  { id: "4", name: "Media Connect",   logoUrl: logoDataUrl("Media Connect",   "#1e3a8a", "#4f46e5") },
  { id: "5", name: "Royal Stays",     logoUrl: logoDataUrl("Royal Stays",     "#172554", "#b7791f") },
  { id: "6", name: "Spark Lights",    logoUrl: logoDataUrl("Spark Lights",    "#111827", "#ea580c") },
  { id: "7", name: "Creative Prints", logoUrl: logoDataUrl("Creative Prints", "#111827", "#06b6d4") },
];

const card = "rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] p-3 shadow-sm";

// ─── Live Preview ─────────────────────────────────────────────────────────────
function SponsorsLivePreview({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <div className={`${card} space-y-3`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[12px] font-semibold text-[var(--vendor-text)]">Live Preview</span>
        <span className="text-[11px] text-[var(--vendor-text-muted)]">
          — This is how the sponsor wall will appear on the website.
        </span>
      </div>

      {/* 4-col grid */}
      {sponsors.length > 0 ? (
        <div className="grid grid-cols-4 gap-3">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex h-[120px] items-center justify-center overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-white p-4"
            >
              <img
                src={sponsor.logoUrl}
                alt={sponsor.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center rounded-[var(--vendor-radius-panel)] border border-dashed border-[var(--vendor-border)] bg-slate-50">
          <p className="text-[11px] text-[var(--vendor-text-muted)]">No sponsors added yet.</p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PortfolioSponsorsPage() {
  const [sponsors, setSponsors] = React.useState<Sponsor[]>(initialSponsors);
  const [sponsorName, setSponsorName] = React.useState("");
  const [draftLogo, setDraftLogo] = React.useState<string | null>(null);
  const objectUrlsRef = React.useRef<string[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => { setIsSaving(true); setTimeout(() => setIsSaving(false), 800); };
  const handleCancel = () => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current = [];
    setSponsors(initialSponsors);
    setSponsorName("");
    setDraftLogo(null);
  };

  React.useEffect(() => {
    return () => { objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url)); };
  }, []);

  const handleLogoSelect = (file: File) => {
    if (draftLogo?.startsWith("blob:")) URL.revokeObjectURL(draftLogo);
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.push(url);
    setDraftLogo(url);
  };

  const addSponsor = () => {
    const name = sponsorName.trim();
    if (!name) return;
    setSponsors((prev) => [...prev, {
      id: `${Date.now()}`,
      name,
      logoUrl: draftLogo ?? logoDataUrl(name, "#0f172a", "#2563eb"),
    }]);
    setSponsorName("");
    setDraftLogo(null);
  };

  const removeSponsor = (id: string) => setSponsors((prev) => prev.filter((s) => s.id !== id));

  const handleReorder = (reordered: DraggableItemListItem[]) => {
    const reorderedSponsors = reordered.map(
      (item) => sponsors.find((s) => s.id === item.id) as Sponsor,
    );
    setSponsors(reorderedSponsors);
  };

  const sponsorItems: DraggableItemListItem[] = sponsors.map((sponsor) => ({
    id: sponsor.id,
    label: sponsor.name,
    rightContent: (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-white p-0.5">
        <img src={sponsor.logoUrl} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
      </div>
    ),
  }));

  const form = (
    <div className="grid gap-3 grid-cols-1 lg:grid-cols-[300px_1fr] items-start">

      {/* ── Left: Add form + sponsors list ── */}
      <div className={`${card} space-y-3`}>
        {/* Add New Sponsor */}
        <div>
          <p className="text-[13px] font-black text-[var(--vendor-text)]">Add New Sponsor</p>
        </div>

        <div className="space-y-0.5">
          <p className="text-[11px] font-medium text-[var(--vendor-text)]">Upload Logo</p>
          <ImageUpload
            key={draftLogo ?? "empty"}
            value={draftLogo ?? undefined}
            label="Sponsor Logo"
            recommendedSize="300x200px"
            maxFileSize="2MB"
            onFileSelect={handleLogoSelect}
            onRemove={() => setDraftLogo(null)}
          />
        </div>

        <BuilderCountedInput
          label="Sponsor Name"
          value={sponsorName}
          onChange={setSponsorName}
          maxLength={100}
          placeholder="Enter sponsor name"
          className="space-y-0.5"
        />

        <Button
          type="button"
          onClick={addSponsor}
          className="w-full justify-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Sponsor
        </Button>

        {/* Divider */}
        <div className="border-t border-[var(--vendor-border)] pt-2">
          <p className="text-[12px] font-black text-[var(--vendor-text)] mb-2">
            Added Sponsors ({sponsors.length})
          </p>

          <DraggableItemList
            items={sponsorItems}
            variant="flat"
            onReorder={handleReorder}
            onDelete={(item) => removeSponsor(item.id as string)}
            emptyText="No sponsors added yet."
          />

          <p className="pt-2 text-[10px] text-[var(--vendor-text-muted)]">
            You can upload up to 30 sponsors.
          </p>
        </div>
      </div>

      {/* ── Right: Live Preview ── */}
      <SponsorsLivePreview sponsors={sponsors} />

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
      leftClassName="border-0 bg-transparent p-0 shadow-none"
    />
  );
}